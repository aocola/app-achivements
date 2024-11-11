import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { User, UserAttributes } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from "src/users/domain/exceptions/already-exists";


@CustomInjectable()
export class CreateUserService {
    constructor(private readonly repository: UserRepository) {}

    async execute(dto: CreateUserDto): Promise<object> {
        const existingUser = await this.repository.getById(dto.userId);
        if (existingUser) {
            throw new UserAlreadyExistsException(dto.userId);
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const userObj = User.create({
            ...dto,
            password: hashedPassword,
        });
        const user = await this.repository.create(userObj);
        return user.toPublicValue();
    }
}
