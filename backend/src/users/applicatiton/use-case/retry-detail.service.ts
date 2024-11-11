import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { getMedal } from "../constants/medals";

@CustomInjectable()
export class RetryDetailService {
    constructor(
        private readonly detailRepository: DetailRepository,
        private readonly medalRepository: MedalRepository,
    ) {}

    async execute(detailId: string): Promise<boolean> {
        // 1. Obtener el detalle por su ID
        const detail = await this.detailRepository.getById(detailId);
        if (!detail) {
            throw new Error(`Detalle con ID ${detailId} no encontrado.`);
        }

        // 2. Validar que el estado del detalle sea REJECTED
        if (detail.toValue().status !== 'REJECTED') {
            throw new Error(`Solo se pueden reintentar detalles en estado REJECTED.`);
        }

        // 3. Cambiar el estado del detalle a PENDING
        detail.retry(); // Método que cambia el estado a PENDING
        await this.detailRepository.update(detail);

        // 4. Recalcular el total de clientes aprobados
        const userDetails = await this.detailRepository.getByUserId(detail.toValue().userId);
        const totalClients = userDetails
            .filter(d => d.toValue().status === 'APPROVED')
            .reduce((acc, d) => acc + d.toValue().counter, 0);

        // 5. Recalcular medallas del usuario
        await this.adjustMedals(detail.toValue().userId, totalClients);

        // Emitir evento de actualización en tiempo real

        return true;
    }

    // Método para ajustar medallas después del reintento o rechazo
    private async adjustMedals(userId: string, totalClients: number): Promise<void> {
        const currentMedals = await this.medalRepository.getByUserId(userId);
        const currentMedalType = getMedal(totalClients);
        //AJUSTAR por medallas por debajo
        
        for (const medal of currentMedals) {
            if (medal.toValue().tipo === currentMedalType && medal.toValue().status === 'BLOQUEADA') {
                medal.unlock(); // Pasar de BLOQUEADA a NO_VERIFICADA
                await this.medalRepository.update(medal);
            }
        }
    }
    
}
