import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { MEDAL_STATUS } from "../constants/medals";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { NotificationGateway } from "src/users/infrastructure/gateway/details.gateway.websocket";
import { Inject } from "@nestjs/common";
import { Detalle } from "src/users/domain/entities/detail.entity";
import { DETAIL_STATUS } from "../constants/detail";

@CustomInjectable()
export class RejectDetailService {
    constructor(
         @Inject('DetailRepository') private readonly detailRepository: DetailRepository,
         @Inject('MedalRepository') private readonly medalRepository: MedalRepository,
        private readonly notificationGateway: NotificationGateway
    ) {}

    /**
     * Rechaza un detalle por su ID, ajusta el estado de las medallas asociadas y notifica el rechazo.
     *
     * @param {string} detailId - El ID del detalle que será rechazado.
     * @returns {Promise<boolean>} `true` si el detalle se rechazó correctamente.
     * @throws {Error} Si el detalle no se encuentra.
     */
    async execute(detailId: string): Promise<boolean> {
        const detail = await this.getDetailOrThrow(detailId);
      
        await this.rejectDetail(detail);
      
        const userId = detail.getOwner();
        const userMedals = await this.medalRepository.getByUserId(userId);
        const unverifiedMedal = this.findUnverifiedMedal(userMedals);
      
        if (unverifiedMedal) {
          const detailList = await this.detailRepository.getByUserId(userId);
          await this.adjustMedals(unverifiedMedal, detailList);
        }
      
        this.notifyReject(detailId);
        return true;
      }
      
      private async getDetailOrThrow(detailId: string): Promise<Detalle> {
        const detail = await this.detailRepository.getById(detailId);
        if (!detail) {
          throw new Error(`Detalle con ID ${detailId} no encontrado.`);
        }
        return detail;
      }
      
      private async rejectDetail(detail: Detalle): Promise<void> {
        detail.reject();
        await this.detailRepository.update(detail);
      }
      
      private findUnverifiedMedal(userMedals: Medalla[]): Medalla | undefined {
        return userMedals.find(medal => medal.getStatus() === MEDAL_STATUS.NO_VERIFICADA);
      }
      
    private async adjustMedals(medal: Medalla, detailList:Detalle[]): Promise<void> {
        const pendingDetails = detailList.filter(item=>item.getStatus()===DETAIL_STATUS.PENDING);
        if(!pendingDetails.length){
            medal.block();
            await this.medalRepository.update(medal);
        }
    }
    
    private notifyReject(detailId: string): void{
        this.notificationGateway.server.to('admin').emit('removeDetail', { detailId });
    }
}
