import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailRepository } from "src/users/domain/repository/detail.repository";



@CustomInjectable()
export class GetAllDetailService {
    constructor(@Inject('DetailRepository') private readonly repository: DetailRepository){}

    /**
     * Obtiene todos los detalles almacenados en el repositorio.
     *
     * @returns {Promise<object[]>} Una lista de objetos que representan los detalles.
     */
    async execute():Promise<object>{
        const details = await this.repository.getAll();
        return details.map(d=>d.toValue());
    }
}