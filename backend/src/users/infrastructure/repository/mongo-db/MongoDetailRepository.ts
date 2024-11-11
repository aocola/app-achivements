import { InjectModel } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Detalle, DetalleAttributes } from "src/users/domain/entities/detail.entity";
import { DetailRepository } from "src/users/domain/repository/detail.repository";

@CustomInjectable()
export class MongoDetailRepository implements DetailRepository {

    constructor(
        @InjectModel(Detalle.name) private detailModel: Model<HydratedDocument<DetalleAttributes>>
    ){}
    async getById(detalleId: string): Promise<Detalle> {
       const document = await this.detailModel.findOne({detalleId});
       return this.mapToEntity(document);
    }
    
    async create(detail: Detalle): Promise<Detalle> {
        const document = await new this.detailModel(detail.toValue()).save();
        return this.mapToEntity(document);
    }
    async update(detail: Detalle): Promise<void> {
        const { detalleId, ...updateFields } = detail.toValue();
        await this.detailModel.updateOne({ detalleId: detalleId }, { $set: updateFields }).exec();
    }
    async getAll(): Promise<Detalle[]> {
        const document = await this.detailModel.find();
        return document.map(item=>this.mapToEntity(item));
    }

    async getByUserId(userId: string): Promise<Detalle[]> {
        const document = await this.detailModel.find({userId});
        return document.map(item=>this.mapToEntity(item));
    }

    private mapToEntity(document: HydratedDocument<DetalleAttributes>): Detalle {
        const detalleAttributes: DetalleAttributes = {
            detalleId: document.detalleId,
            userId: document.userId,
            status: document.status,
            medal: document.medal,
            counter: document.counter,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };
        return new Detalle(detalleAttributes);
    }
}