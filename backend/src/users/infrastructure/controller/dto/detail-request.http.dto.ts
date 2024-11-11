import { IsNotEmpty, IsString } from 'class-validator';

export class DetalleRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string; 
}