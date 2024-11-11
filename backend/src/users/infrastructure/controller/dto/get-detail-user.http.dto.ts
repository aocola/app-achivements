import { IsNotEmpty, IsString } from 'class-validator';

export class GetDetallesByUserIdDto {
  @IsString()
  @IsNotEmpty()
  id: string; // ID del usuario para obtener sus detalles
}