import { InjectModel } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Model } from "mongoose";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Medalla, MedallaAttributes } from "src/users/domain/entities/medal.entity";
import { MedalRepository } from "src/users/domain/repository/medal.repository";

@CustomInjectable()
export class MongoMedalRepository implements MedalRepository{

    constructor(
        @InjectModel(Medalla.name) private medalModel: Model<HydratedDocument<MedallaAttributes>>
    ){}

    async create(medal: Medalla): Promise<Medalla> {
        const document = await new this.medalModel(medal.toValue()).save();
        return this.mapToEntity(document);
    }
    async update(medal: Medalla): Promise<void> {
        const { medallaId, ...updateFields } = medal.toValue();
        await this.medalModel.updateOne({ medallaId: medallaId }, { $set: updateFields }).exec();
    }
    async getByUserId(userId: string): Promise<Medalla[]> {
        const documents = await this.medalModel.find({ userId }).sort({ createdAt: -1 }).exec();
        return documents.map(item => this.mapToEntity(item));
    }

    private mapToEntity(document: HydratedDocument<MedallaAttributes>): Medalla {
        const medallaAttributes: MedallaAttributes = {
            medallaId: document.medallaId,
            userId: document.userId,
            tipo: document.tipo,
            status: document.status,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
        return new Medalla(medallaAttributes);
    }
}