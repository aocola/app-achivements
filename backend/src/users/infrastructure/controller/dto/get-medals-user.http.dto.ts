import { IsNotEmpty, IsString } from 'class-validator';

export class GetMedalsByUserIdDto {
  @IsString()
  @IsNotEmpty()
  id: string; // ID del usuario para obtener sus detalles
}