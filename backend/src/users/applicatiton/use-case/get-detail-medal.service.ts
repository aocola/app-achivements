import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { getHighestMedal, getHighestMedalFromSet, getMaximumMedal, MEDAL_STATUS } from "../constants/medals";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { Detalle } from "src/users/domain/entities/detail.entity";

@CustomInjectable()
export class GetDetailMedalService {
    constructor(@Inject('DetailRepository') private readonly detailRepository: DetailRepository,
        @Inject('MedalRepository') private readonly medalRepository: MedalRepository) { }

    /**
    * Calcula el total de contadores acumulados de los detalles aprobados relacionados con una medalla no verificada.
    *
    * @param {string} userId - El ID del usuario cuyos detalles y medallas serán evaluados.
    * @returns {Promise<number>} El total de contadores acumulados.
    */
    async execute(userId: string): Promise<number> {
        const unverifiedMedal = await this.getUnverifiedMedal(userId);

        if (!unverifiedMedal) {
            return 0;
        }

        const approvedDetails = await this.getApprovedDetailsForMedal(userId, unverifiedMedal.getType());

        return this.calculateTotalCounter(approvedDetails);
    }

    private async getUnverifiedMedal(userId: string): Promise<Medalla | undefined> {
        const medals = await this.medalRepository.getByUserId(userId);
        return medals.find(medal => medal.getStatus() === MEDAL_STATUS.NO_VERIFICADA);
    }

    private async getApprovedDetailsForMedal(userId: string, medalType: string): Promise<Detalle[]> {
        const detailList = await this.detailRepository.getByUserId(userId);
        return detailList.filter(detail => detail.getStatus() === "APPROVED" && detail.getMedal() === medalType);
    }

    private calculateTotalCounter(details: Detalle[]): number {
        return details.reduce((acc, detail) => acc + detail.getCounter(), 0);
    }

}