import { Detalle } from "../entities/detail.entity";

export abstract class DetailRepository {
    abstract create(detail: Detalle): Promise<Detalle>;
    abstract update(detail: Detalle): Promise<void>;
    abstract getAll(): Promise<Detalle[]>;
    abstract getByUserId(userId:string): Promise<Detalle[]>;
    abstract getById(detailId:string):Promise<Detalle>;
}