import { Medalla } from "../entities/medal.entity";

export interface MedalRepository {
    create(medal: Medalla): Promise<Medalla>;
    update(medal:Medalla): Promise<void>;
    getByUserId(userId:string, status?:string):Promise<Medalla[]>;
}