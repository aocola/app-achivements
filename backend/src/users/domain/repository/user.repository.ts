import { User, UserAttributes } from "../entities/user.entity";

export abstract class UserRepository {
    abstract create(user: User): Promise<User>;
    abstract update(user:User): Promise<void>;
    abstract getById(id: string): Promise<User | null>;
}