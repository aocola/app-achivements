import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { DetailNotFoundException } from "src/users/domain/exceptions/detail-not-found";
import { DetailRepository } from "src/users/domain/repository/detail.repository";

@CustomInjectable()
export class GetUserDetailService {
    constructor(@Inject('DetailRepository')private readonly repository: DetailRepository){}

     /**
     * Obtiene los detalles asociados a un usuario dado su ID.
     *
     * @param {string} id - El ID del usuario cuyos detalles serán recuperados.
     * @returns {Promise<object[]>} Una lista de objetos que representan los detalles del usuario.
     * @throws {DetailNotFoundException} Si no se encuentran detalles para el usuario dado.
     */
    async execute(id: string): Promise<object> {
        const detail = await this.repository.getByUserId(id);
        if(!detail) {
            throw new DetailNotFoundException(id);
        }
        return detail.map(d=>d.toValue());
    }
}