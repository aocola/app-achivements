import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { CreateClienteDto } from "../dto/create-customer.dto";
import { Detalle } from "src/users/domain/entities/detail.entity";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { CustomerRepository } from "src/users/domain/repository/customers.repository";
import { Cliente } from "src/users/domain/entities/client.entity";
import { MEDAL_STATUS, getHighestMedalFromSet, getMaximumMedal, getMinimalMedal, getNextMedal } from "../constants/medals";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { NotificationGateway } from "src/users/infrastructure/gateway/details.gateway.websocket";
import { Inject } from "@nestjs/common";

@CustomInjectable()
export class RegisterCustomerService {
  constructor(
    @Inject('DetailRepository') private readonly detailRepository: DetailRepository,
    @Inject('CustomerRepository') private readonly customerRepository: CustomerRepository,
    @Inject('MedalRepository') private readonly medalRepository: MedalRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * Registra clientes asociados a un usuario, crea un detalle, verifica y asigna medallas, y notifica el registro.
   *
   * @param {string} userId - El ID del usuario asociado al registro de los clientes.
   * @param {CreateClienteDto[]} clientes - La lista de datos de los clientes a registrar.
   * @returns {Promise<void>} No retorna valor, lanza excepciones si ocurre algún error.
   * @throws {Error} Si ocurre un error al registrar clientes o verificar medallas.
   */
  async execute(userId: string, clientes: CreateClienteDto[]): Promise<void> {
    try {
      const detalle = await this.createDetalle(userId, clientes.length);
      await this.insertCustomers(detalle.getId(), clientes);
      await this.verifyAndAssignMedals(userId, detalle);
      this.notifyDetailRegister(detalle);
    } catch (error) {
      throw new Error("No se pudo registrar los clientes y verificar medallas.");
    }
  }

  private async createDetalle(userId: string, counter: number): Promise<Detalle> {
    const detailData = Detalle.create({ userId, counter });
    return this.detailRepository.create(detailData);
  }

  private async insertCustomers(detalleId: string, clientes: CreateClienteDto[]): Promise<void> {
    const customers = clientes.map(cliente => Cliente.create({ detalleId, ...cliente }));
    await this.customerRepository.insertAll(customers);
  }

  private async verifyAndAssignMedals(userId: string, detalle: Detalle): Promise<void> {
    const medals = await this.medalRepository.getByUserId(userId);

    if (medals.length === 0) {
      await this.createMedal(userId, getMinimalMedal(), MEDAL_STATUS.NO_VERIFICADA);
      return;
    }

    const unverifiedMedal = medals.find(
      item => item.getStatus() === MEDAL_STATUS.NO_VERIFICADA || item.getStatus() === MEDAL_STATUS.BLOQUEADA,
    );

    if (unverifiedMedal) {
      if (unverifiedMedal.getStatus() === MEDAL_STATUS.BLOQUEADA) {
        await this.updateUnverifyMedal(unverifiedMedal);
      }
    } else {
      const currentMedalTypes = new Set(medals.map(m => m.getType()));
      const highestMedal = getHighestMedalFromSet(currentMedalTypes);

      if (highestMedal !== getMaximumMedal()) {
        const nextMedal = getNextMedal(highestMedal);
        await this.createMedal(userId, nextMedal, MEDAL_STATUS.NO_VERIFICADA);
      } else {
        this.notifyMaxMedalAchieved(detalle, userId, highestMedal); 
      }
    }
  }

  private async updateUnverifyMedal(medal: Medalla): Promise<void> {
    medal.notVerify();
    await this.medalRepository.update(medal);
  }

  private async createMedal(userId: string, tipo: string, status: 'NO_VERIFICADA' | 'BLOQUEADA'): Promise<void> {
    const newMedal = Medalla.create({ userId, tipo, status });
    await this.medalRepository.create(newMedal);
  }

  private notifyDetailRegister(detail: Detalle): void {
    this.notificationGateway.server.to('admin').emit('notifyDetail', detail.toValue());
  }

  private notifyMaxMedalAchieved(detail: Detalle, userId: string, medalType: string): void {
    const notificationData = {
      detail: detail.toValue(),
      message: `El usuario con ID ${userId} ha alcanzado la medalla máxima (${medalType}).`,
    };
    this.notificationGateway.server.to('admin').emit('notifyMaxMedal', notificationData);
  }
}
