import { User, UserAttributes } from "../entities/user.entity";

export interface UserRepository {
    create(user: User): Promise<User>;
    update(user:User): Promise<void>;
    getById(id: string): Promise<User | null>;
}