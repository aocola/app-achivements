import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { getMedal, getSuperiorMedals, isMedalType } from "../constants/medals";
import { Medalla } from "src/users/domain/entities/medal.entity";

@CustomInjectable()
export class RejectDetailService {
    constructor(
        private readonly detailRepository: DetailRepository,
        private readonly medalRepository: MedalRepository
    ) {}

    async execute(detailId: string): Promise<boolean> {
        // 1. Obtener el detalle por su ID
        const detail = await this.detailRepository.getById(detailId);
        if (!detail) {
            throw new Error(`Detalle con ID ${detailId} no encontrado.`);
        }

        // 2. Actualizar el estado del detalle a "REJECTED"
        detail.reject(); // Método que cambia el estado a REJECTED
        await this.detailRepository.update(detail);

        // 3. Recalcular el total de clientes aprobados del usuario
        const userId = detail.toValue().userId;
        const approvedDetails = await this.detailRepository.getByUserId(userId);
        const totalClients = approvedDetails
            .filter(d => d.toValue().status === 'APPROVED' || d.toValue().status === 'PENDING')
            .reduce((acc, d) => acc + d.toValue().counter, 0);

        // 4. Determinar la nueva medalla correspondiente basada en los clientes restantes
        const newMedalType = getMedal(totalClients);
        const currentMedals = await this.medalRepository.getByUserId(userId);

        // 5. Ajustar el estado de las medallas si es necesario
        await this.adjustMedals(newMedalType, currentMedals);

        // Emitir evento de actualización en tiempo real

        return true;
    }
    //TODO: Corregir rechazar: estado de medalla pasa a bloqueado ambas inmortal y platino
    private async adjustMedals(newMedalType: string, currentMedals: Medalla[]): Promise<void> {
        // Obtener medallas superiores al tipo de medalla actual
        if (!isMedalType(newMedalType)) {
            throw new Error(`Tipo de medalla inválido: ${newMedalType}`);
        }
        const superiorMedals = getSuperiorMedals(newMedalType);
        for (const medal of currentMedals) {
            const medalValue = medal.toValue();
            if (!isMedalType(medalValue.tipo)) {
                throw new Error(`Tipo de medalla inválido: ${medalValue.tipo}`);
            }
            
            if (superiorMedals.includes(medalValue.tipo) && medalValue.status !== 'BLOQUEADA') {
                medal.block(); // Cambia a BLOQUEADA
                await this.medalRepository.update(medal);
            } 
        }
    }
    
    
}
