import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";



@CustomInjectable()
export class GetAllDetailService {
    constructor(private readonly repository: DetailRepository){}

    async execute():Promise<object>{
        const details = await this.repository.getAll();
        return details.map(d=>d.toValue());
    }
}