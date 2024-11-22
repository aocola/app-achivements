import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { MedalRepository } from "src/users/domain/repository/medal.repository";
import { getHighestMedal, getHighestMedalFromSet, getMaximumMedal, MEDAL_STATUS } from "../constants/medals";

@CustomInjectable()
export class GetDetailMedalService {
    constructor(@Inject('DetailRepository') private readonly detailRepository: DetailRepository,
                @Inject('MedalRepository') private readonly medalRepository: MedalRepository){}

     /**
     * Calcula el total de contadores acumulados de los detalles aprobados relacionados con una medalla no verificada.
     *
     * @param {string} userId - El ID del usuario cuyos detalles y medallas serán evaluados.
     * @returns {Promise<number>} El total de contadores acumulados.
     */
    async execute(userId:string):Promise<number>{
        const medals = await this.medalRepository.getByUserId(userId);
        const detailList = await this.detailRepository.getByUserId(userId);
         
        const unverifiedMedal = medals.find(item=>item.getStatus()===MEDAL_STATUS.NO_VERIFICADA);
        if(unverifiedMedal){
            const detailFiltered = unverifiedMedal?detailList.filter(item=>item.getStatus()==="APPROVED" && item.getMedal()===unverifiedMedal.getType()):[];        
            return detailFiltered.reduce((acc,item)=>acc+item.getCounter(),0);
        }
        return 0;
    }
}