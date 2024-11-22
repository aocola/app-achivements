import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { User } from "src/users/domain/entities/user.entity";
import { UserRepository } from "src/users/domain/repository/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from "src/users/domain/exceptions/already-exists";
import { Inject } from "@nestjs/common";


@CustomInjectable()
export class CreateUserService {
    constructor(@Inject('UserRepository') private readonly repository: UserRepository) {}

     /**
     * Crea un nuevo usuario en el sistema.
     * Verifica si el usuario ya existe, encripta la contraseña y guarda el nuevo usuario.
     *
     * @param {CreateUserDto} dto - Los datos necesarios para crear un usuario.
     * @returns {Promise<object>} Un objeto público con la información del usuario creado.
     * @throws {UserAlreadyExistsException} Si ya existe un usuario con el mismo ID.
     */
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
