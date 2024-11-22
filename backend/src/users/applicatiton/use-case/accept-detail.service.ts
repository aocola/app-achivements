import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { NotificationGateway } from "src/users/infrastructure/gateway/details.gateway.websocket";
import { Detalle } from "src/users/domain/entities/detail.entity";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { Inject } from "@nestjs/common";
import { getHighestMedalFromSet, getMaximumMedal, getNextMedal, getSuperiorMedals, MEDAL_STATUS, MEDALS, RANGE_PER_MEDAL } from "../constants/medals";
import { DETAIL_STATUS } from "../constants/detail";

@CustomInjectable()
export class AcceptDetailService {
  constructor(
    @Inject('DetailRepository') private readonly detailRepository: DetailRepository,
    @Inject('MedalRepository') private readonly medalRepository: MedalRepository,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  /**
   * Procesa la aprobación de un detalle dado su ID. Verifica el progreso del usuario para 
   * actualizar sus medallas y notifica tanto la aprobación del detalle como logros relacionados.
   *
   * @param {string} detailId - El ID del detalle que será procesado.
   * @returns {Promise<boolean>} true si el detalle se aprobó y procesó correctamente.
   * @throws {Error} Si el detalle no existe o ya está aprobado.
   */
  async execute(detailId: string): Promise<boolean> {
    const detail = await this.detailRepository.getById(detailId);
    if (!detail) throw new Error("Detalle con ID ${detailId} no encontrado.");
    if (detail.getStatus() !== DETAIL_STATUS.PENDING) {
      throw new Error("Detalle con ID ${detailId} ya está aprobado");
    }

    const userId = detail.getOwner();
    const counterIncome = detail.getCounter();
    const medalCurrentType = await this.verifyUpgradeMedals(userId, counterIncome);

    detail.approve();
    detail.setMedal(medalCurrentType);
    await this.detailRepository.update(detail);
    this.notifyApproval(detail);

    return true;
  }

  /**
   * Verifica si un usuario puede actualizar su medalla basada en su progreso actual.
   * Si no hay medalla no verificada, la crea. Si ya no hay medallas superiores, 
   * retorna la medalla máxima.
   *
   * @param {string} userId - El ID del usuario cuyas medallas serán verificadas.
   * @param {number} counterIncome - El ingreso de contador adicional para evaluar el progreso.
   * @returns {Promise<string>} El tipo de medalla actualizada o la medalla máxima.
   */
  private async verifyUpgradeMedals(userId: string, counterIncome: number): Promise<string> {
    const userMedals = await this.medalRepository.getByUserId(userId);
  
    const currentMedal = await this.getOrCreateUnverifiedMedal(userId, userMedals);
  
    const totalCounter = await this.calculateTotalCounter(userId, currentMedal, counterIncome);
  
    await this.updateMedalIfEligible(currentMedal, totalCounter);
  
    return currentMedal.getType();
  }
  
  private async getOrCreateUnverifiedMedal(userId: string, userMedals: Medalla[]): Promise<Medalla> {
    const unverifiedMedal = userMedals.find(medal => medal.getStatus() === MEDAL_STATUS.NO_VERIFICADA);
    if (unverifiedMedal) {
      return unverifiedMedal;
    }
    return await this.handleNoUnverifiedMedal(userId, userMedals);
  }
  
  private async calculateTotalCounter(userId: string, medal: Medalla, counterIncome: number): Promise<number> {
    const detailList = await this.detailRepository.getByUserId(userId);
    return detailList
      .filter(detail => detail.getMedal() === medal.getType() && detail.getStatus() === DETAIL_STATUS.APPROVED)
      .reduce((acc, detail) => acc + detail.getCounter(), counterIncome);
  }
  
  private async updateMedalIfEligible(medal: Medalla, totalCounter: number): Promise<void> {
    if (totalCounter >= RANGE_PER_MEDAL && medal.getStatus() === MEDAL_STATUS.NO_VERIFICADA) {
      medal.verify();
      await this.medalRepository.update(medal);
      this.notifyAchivement(medal);
    }
  }
  

  /**
   * Maneja la creación de una medalla no verificada o devuelve la medalla máxima si no hay más por crear.
   *
   * @param {string} userId - El ID del usuario.
   * @param {Medalla[]} userMedals - Lista de medallas actuales del usuario.
   * @returns {Promise<string>} El tipo de la nueva medalla no verificada o la medalla máxima.
   */
  private async handleNoUnverifiedMedal(userId: string, userMedals: Medalla[]): Promise<Medalla> {
    const currentMedalTypes = new Set(userMedals.map(m => m.getType()));
    const highestMedal = getHighestMedalFromSet(currentMedalTypes);

    if (highestMedal !== getMaximumMedal()) {
      console.log("highestMedal",highestMedal);
      console.log("getNextMedal(highestMedal)",getNextMedal(highestMedal));
      const newMedal = await this.createMedal(userId, getNextMedal(highestMedal), MEDAL_STATUS.NO_VERIFICADA);
      return newMedal;
    }

    return userMedals.find(item=>item.getType()===getMaximumMedal());
  }

  private async createMedal(userId: string, tipo: string, status: 'NO_VERIFICADA' | 'BLOQUEADA'): Promise<Medalla> {
    const newMedal = Medalla.create({ userId, tipo, status });
    return await this.medalRepository.create(newMedal);
  }

  private notifyApproval(detail: Detalle): void {
    const detailId = detail.getId();
    const userId = detail.getOwner();
    this.notificationGateway.server.to('admin').emit('removeDetail', { detailId });
    this.notificationGateway.server.to(userId).emit('notifyApproval', detail.toValue());
  }

  private notifyAchivement(medal: Medalla): void {
    const userId = medal.getOwner();
    this.notificationGateway.server.to(userId).emit('notifyAchivement', { ...medal.toValue() });
  }
} 