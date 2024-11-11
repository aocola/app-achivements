import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { getMedal, getPreviousMedals, getSuperiorMedals, isMedalType, isNoMedal, isValidMedal, MedalType } from "../constants/medals";
import { NotificationGateway } from "src/users/infrastructure/gateway/details.gateway.websocket";

@CustomInjectable()
export class AcceptDetailService {
    constructor(
        private readonly detailRepository: DetailRepository,
        private readonly medalRepository: MedalRepository,
        private readonly notificationGateway: NotificationGateway
    ) {}

    async execute(detailId: string): Promise<boolean> {
        const detail = await this.detailRepository.getById(detailId);
        if (!detail) throw new Error(`Detalle con ID ${detailId} no encontrado.`);
    
        detail.approve();
        await this.detailRepository.update(detail);
        this.notificationGateway.server.to('admin').emit('removeDetail', { detailId });
        this.notificationGateway.server.to(detail.toValue().userId).emit('notifyApproval', detail.toValue());

        const userDetails = await this.detailRepository.getByUserId(detail.toValue().userId);
        const totalClientsApproved = userDetails
            .filter(d => d.toValue().status === 'APPROVED')
            .reduce((acc, d) => acc + d.toValue().counter, 0);
        const totalClients = userDetails
            .reduce((acc, d) => acc + d.toValue().counter, 0);

        const medalType = getMedal(totalClientsApproved);
        const userMedals = await this.medalRepository.getByUserId(detail.toValue().userId);
        
        if (!isMedalType(medalType)) {
            throw new Error(`Tipo de medalla inválido: ${medalType}`);
        }
        const previousMedals = new Set(getPreviousMedals(medalType));
        !isNoMedal(medalType) && isValidMedal(totalClientsApproved, medalType) && previousMedals.add(medalType);

        for (const medal of userMedals) {
            const medalValue = medal.toValue();
            const { status, tipo } = medalValue;

            if (status === "NO_VERIFICADA" || status === "BLOQUEADA") {
                if (!isMedalType(tipo)) {
                    throw new Error(`Tipo de medalla inválido: ${tipo}`);
                }

                if (previousMedals.has(tipo)) {
                    detail.setMedal(medal.toValue().tipo);
                    await this.detailRepository.update(detail);
                    medal.verify();
                    this.notificationGateway.server.to(detail.toValue().userId).emit('notifyAchivement', { ...medal });
                }
            }

            await this.medalRepository.update(medal);
        }
        
        if(totalClientsApproved>0 && totalClients !== totalClientsApproved){
            const superiorMedals = getSuperiorMedals(medalType);

            for (const superiorMedalType of superiorMedals) {
                const existingMedal = userMedals.find(
                    (medal) => medal.toValue().tipo === superiorMedalType
                );

                if (existingMedal) {
                    const medalValue = existingMedal.toValue();
                    if (medalValue.status === "BLOQUEADA") {
                        existingMedal.notVerify();
                        await this.medalRepository.update(existingMedal);
                    }
                    break;
                }
            }
        }
        return true;
    }
    
}
