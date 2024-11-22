import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Detalle } from "src/users/domain/entities/detail.entity";
import { DetailNotFoundException } from "src/users/domain/exceptions/detail-not-found";
import { DetailRepository } from "src/users/domain/repository/detail.repository";

@CustomInjectable()
export class GetUserDetailService {
  constructor(@Inject('DetailRepository') private readonly repository: DetailRepository) {}

  /**
   * Obtiene los detalles asociados a un usuario dado su ID.
   *
   * @param {string} id - El ID del usuario cuyos detalles serán recuperados.
   * @returns {Promise<object[]>} Una lista de objetos que representan los detalles del usuario.
   * @throws {DetailNotFoundException} Si no se encuentran detalles para el usuario dado.
   */
  async execute(id: string): Promise<object[]> {
    const userDetails = await this.fetchUserDetailsOrThrow(id);
    return this.mapDetailsToValues(userDetails);
  }

  private async fetchUserDetailsOrThrow(userId: string): Promise<Detalle[]> {
    const details = await this.repository.getByUserId(userId);
    if (!details || details.length === 0) {
      throw new DetailNotFoundException(userId);
    }
    return details;
  }

  private mapDetailsToValues(details: Detalle[]): object[] {
    return details.map(detail => detail.toValue());
  }
}
