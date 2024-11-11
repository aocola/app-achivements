import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDetalleStatusDto {
  @IsString()
  @IsNotEmpty()
  detalleId: string; // ID del detalle a actualizar

  @IsEnum(['APPROVED', 'REJECTED'], {
    message: 'El estado debe ser APPROVED o REJECTED',
  })
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED'; // Estado del detalle
}
