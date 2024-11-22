import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Detalle } from "src/users/domain/entities/detail.entity";
import { DetailRepository } from "src/users/domain/repository/detail.repository";



@CustomInjectable()
export class GetAllDetailService {
  constructor(@Inject('DetailRepository') private readonly repository: DetailRepository) {}

  /**
   * Obtiene todos los detalles almacenados en el repositorio.
   *
   * @returns {Promise<object[]>} Una lista de objetos que representan los detalles.
   */
  async execute(): Promise<object[]> {
    const details = await this.fetchAllDetails();
    return this.mapDetailsToValues(details);
  }

  private async fetchAllDetails(): Promise<Detalle[]> {
    return this.repository.getAll();
  }

  private mapDetailsToValues(details: Detalle[]): object[] {
    return details.map(detail => detail.toValue());
  }
}