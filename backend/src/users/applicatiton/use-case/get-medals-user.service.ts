import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { MedalRepository } from "src/users/domain/repository/medal.repository";



@CustomInjectable()
export class GetMedalsByUserService {
    constructor(private readonly repository: MedalRepository){}

    async execute(userId:string):Promise<object>{
        const medals = await this.repository.getByUserId(userId);
        return medals.map(m=>m.toValue());
    }
}