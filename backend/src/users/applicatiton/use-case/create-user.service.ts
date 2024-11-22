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
      await this.ensureUserDoesNotExist(dto.userId);
  
      const hashedPassword = await this.hashPassword(dto.password);
  
      const user = await this.createUser(dto, hashedPassword);
  
      return user.toPublicValue();
    }
  
    private async ensureUserDoesNotExist(userId: string): Promise<void> {
      const existingUser = await this.repository.getById(userId);
      if (existingUser) {
        throw new UserAlreadyExistsException(userId);
      }
    }
  
    private async hashPassword(password: string): Promise<string> {
      return bcrypt.hash(password, 10);
    }
  
    private async createUser(dto: CreateUserDto, hashedPassword: string): Promise<User> {
      const userObj = User.create({
        ...dto,
        password: hashedPassword,
      });
      return this.repository.create(userObj);
    }
  }
  
