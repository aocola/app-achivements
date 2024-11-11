import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  userId: string; // Identificador único del usuario

  @IsString()
  @IsNotEmpty()
  password: string; // Contraseña del usuario
}
