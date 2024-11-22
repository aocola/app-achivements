import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { UserNotFoundException } from "src/users/domain/exceptions/user-not-found";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { InvalidPasswordException } from "src/users/domain/exceptions/invalid-password";
import * as bcrypt from 'bcrypt';
import { Inject } from "@nestjs/common";

@CustomInjectable()
export class LoginUserService {
    constructor( @Inject('UserRepository') private readonly userRepository: UserRepository) {}
    /**
     * Realiza el inicio de sesión de un usuario verificando sus credenciales.
     *
     * @param {string} userId - El ID del usuario que intenta iniciar sesión.
     * @param {string} password - La contraseña proporcionada por el usuario.
     * @returns {Promise<object>} Un objeto público con la información del usuario autenticado.
     * @throws {UserNotFoundException} Si el usuario no existe.
     * @throws {InvalidPasswordException} Si la contraseña es incorrecta.
     */
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
