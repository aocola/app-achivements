import { Detalle } from "../entities/detail.entity";

export interface DetailRepository {
    create(detail: Detalle): Promise<Detalle>;
    update(detail: Detalle): Promise<void>;
    getAll(): Promise<Detalle[]>;
    getByUserId(userId:string): Promise<Detalle[]>;
    getById(detailId:string):Promise<Detalle>;
}