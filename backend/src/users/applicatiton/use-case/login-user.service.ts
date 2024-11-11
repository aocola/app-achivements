import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { UserNotFoundException } from "src/users/domain/exceptions/user-not-found";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { InvalidPasswordException } from "src/users/domain/exceptions/invalid-password";
import { User } from "src/users/domain/entities/user.entity";
import * as bcrypt from 'bcrypt';

@CustomInjectable()
export class LoginUserService {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(userId: string, password: string): Promise<object> {
        const user = await this.userRepository.getById(userId);
        
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        const isPasswordValid = await bcrypt.compare(password, user.toValue().password || '');
        if (!isPasswordValid) {
            throw new InvalidPasswordException();
        }
        
        user.updateLastLogin();
        await this.userRepository.update(user);

        return user.toPublicValue();
    }
}
