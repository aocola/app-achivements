import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailNotFoundException } from "src/users/domain/exceptions/detail-not-found";
import { UserNotFoundException } from "src/users/domain/exceptions/user-not-found";
import { DetailRepository } from "src/users/domain/repository/detail.repository";
import { UserRepository } from "src/users/domain/repository/user.repository";

@CustomInjectable()
export class GetUserDetailService {
    constructor(private readonly repository: DetailRepository){}

    async execute(id: string): Promise<object> {
        const detail = await this.repository.getByUserId(id);
        if(!detail) {
            throw new DetailNotFoundException(id);
        }
        return detail.map(d=>d.toValue());
    }
}