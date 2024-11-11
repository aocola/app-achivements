import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { CreateClienteDto } from "../dto/create-customer.dto";
import { Detalle } from "src/users/domain/entities/detail.entity";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { CustomerRepository } from "src/users/domain/repository/customers.repository";
import { Cliente } from "src/users/domain/entities/client.entity";
import { MedalType, getHighestMedalFromSet, getMedal, getMinimalMedal, getNextMedal, getPreviousMedals, isNoMedal } from "../constants/medals";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { NotificationGateway } from "src/users/infrastructure/gateway/details.gateway.websocket";

@CustomInjectable()
export class RegisterCustomerService {
    constructor(
        private readonly detailRepository: DetailRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly medalRepository: MedalRepository,
        private readonly notificationGateway: NotificationGateway
    ) {}

    async execute(userId: string, clientes: CreateClienteDto[]): Promise<void> {
        try {
            const detalle = await this.createDetalle(userId, clientes.length);
            await this.insertClientes(detalle.toValue().detalleId, clientes);
            await this.verifyAndAssignMedals(userId);
            this.notificationGateway.server.to('admin').emit('notifyDetail', detalle.toValue());
        } catch (error) {
            console.error("Error en RegisterCustomerService:", error);
            throw new Error("No se pudo registrar los clientes y verificar medallas.");
        }
    }

    private async createDetalle(userId: string, counter: number): Promise<Detalle> {
        const detailData = Detalle.create({ userId, counter });
        return this.detailRepository.create(detailData);
    }

    private async insertClientes(detalleId: string, clientes: CreateClienteDto[]): Promise<void> {
        const customers = clientes.map(cliente => Cliente.create({ detalleId, ...cliente }));
        await this.customerRepository.insertAll(customers);
    }

    private async verifyAndAssignMedals(userId: string): Promise<void> {
        const currentCounter = await this.calculateTotalCounter(userId);
        const medal = getMedal(currentCounter);
        const previousMedals = getPreviousMedals(medal);
        const currentMedals = await this.medalRepository.getByUserId(userId);

        const currentMedalTypes = new Set(currentMedals.map(m => m.toValue().tipo));
        const hasUnverifiedMedal = currentMedals.some(m => m.toValue().status === "NO_VERIFICADA");

        const assignedNewMedals = await this.assignInitialMedals(userId, medal, previousMedals, currentMedalTypes, hasUnverifiedMedal);

        if (!assignedNewMedals && !hasUnverifiedMedal) {
            await this.unlockNextBlockedMedal(currentMedals);
        }
    }

    private async calculateTotalCounter(userId: string): Promise<number> {
        const allDetails = await this.detailRepository.getByUserId(userId);
        return allDetails
            .filter(detail => detail.toValue().status !== "REJECTED")
            .reduce((acc, detail) => acc + detail.toValue().counter, 0);
    }

    private async assignInitialMedals(
        userId: string,
        medal: string,
        previousMedals: string[],
        currentMedalTypes: Set<string>,
        hasUnverifiedMedal: boolean
    ): Promise<boolean> {
        let isFirstMedal = true;

        const medalsToCreate = previousMedals
            .filter(m => !currentMedalTypes.has(m))
            .map(m => this.createMedal(userId, isNoMedal(m as MedalType) ? getMinimalMedal() : m, hasUnverifiedMedal || !isFirstMedal ? "BLOQUEADA" : "NO_VERIFICADA"))
            .map(promise => {
                isFirstMedal = false;
                return promise;
            });

        if (!currentMedalTypes.has(medal)) {
            medalsToCreate.push(this.createMedal(userId, medal, hasUnverifiedMedal || !isFirstMedal ? "BLOQUEADA" : "NO_VERIFICADA"));
        }

        if (medalsToCreate.length > 0) {
            await Promise.all(medalsToCreate);
            return true;
        }

        return false;
    }

    private async unlockNextBlockedMedal(currentMedals: Medalla[]): Promise<void> {
        const nonBlockedMedals = new Set(currentMedals.filter(m => m.toValue().status !== "BLOQUEADA").map(m => m.toValue().tipo));
        const highestMedal = getHighestMedalFromSet(nonBlockedMedals);
        const nextMedal = getNextMedal(highestMedal);

        const blockedMedal = currentMedals.find(m => m.toValue().status === "BLOQUEADA" && m.toValue().tipo === nextMedal);

        if (blockedMedal) {
            blockedMedal.unlock();
            await this.medalRepository.update(blockedMedal);
        }
    }

    private async createMedal(userId: string, tipo: string, status: 'NO_VERIFICADA' | 'BLOQUEADA'): Promise<void> {
        const newMedal = Medalla.create({ userId, tipo, status });
        await this.medalRepository.create(newMedal);
    }
}
