import { InjectModel } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { UserAttributes, User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";

@CustomInjectable()
export class MongoUserRepository implements UserRepository {

    constructor(
        @InjectModel(User.name) private userModel: Model<HydratedDocument<UserAttributes>>
    ){}
    async update(user: User): Promise<void> {
        const { userId, ...updateFields } = user.toValue();
        await this.userModel.updateOne({ userId: userId }, { $set: updateFields }).exec();
    }

    async create(user: User): Promise<User> {
        const document = await new this.userModel(user.toValue()).save();
        return this.mapToEntity(document);
    }
    async getById(userId: string): Promise<User | null> {
        const document = await this.userModel.findOne({ userId }).select('+password').exec();
        return document ? this.mapToEntity(document) : null;
    }

    private mapToEntity(document: HydratedDocument<UserAttributes>): User {
        const userAttributes: UserAttributes = {
            userId: document.userId,
            name: document.name,
            role: document.role,
            password: document.password,
            lastDayLogin: document.lastDayLogin,
            isActive: document.isActive,
        };
        return new User(userAttributes);
    }
}