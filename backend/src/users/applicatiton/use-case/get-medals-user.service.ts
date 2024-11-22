import { Inject } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Medalla } from "src/users/domain/entities/medal.entity";
import { MedalRepository } from "src/users/domain/repository/medal.repository";



@CustomInjectable()
export class GetMedalsByUserService {
  constructor(@Inject('MedalRepository') private readonly repository: MedalRepository) {}

  /**
   * Obtiene todas las medallas asociadas a un usuario dado su ID.
   *
   * @param {string} userId - El ID del usuario cuyas medallas serán recuperadas.
   * @returns {Promise<object[]>} Una lista de objetos que representan las medallas del usuario.
   */
  async execute(userId: string): Promise<object[]> {
    const userMedals = await this.fetchUserMedals(userId);
    return this.mapMedalsToValues(userMedals);
  }

  private async fetchUserMedals(userId: string): Promise<Medalla[]> {
    return this.repository.getByUserId(userId);
  }

  private mapMedalsToValues(medals: Medalla[]): object[] {
    return medals.map(medal => medal.toValue());
  }
}
