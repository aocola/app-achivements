import { Medalla } from "../entities/medal.entity";

export abstract class MedalRepository {
    abstract create(medal: Medalla): Promise<Medalla>;
    abstract update(medal:Medalla): Promise<void>;
    abstract getByUserId(userId:string):Promise<Medalla[]>;
}