import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 12) // Ejemplo de validación para DNI con longitud entre 8 y 12 caracteres
    dni: string;
  
    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsString()
    @IsNotEmpty()
    apellidos: string;
  
    @IsEmail()
    @IsNotEmpty()
    correo: string;
  }
  
  export class CreateClientesBatchDto {
    @IsArray()
    @ValidateNested({ each: true }) // Valida cada cliente del arreglo
    @Type(() => CreateClienteDto)
    clientes: CreateClienteDto[];

    @Matches(/^[a-zA-Z0-9]+$/)
    @IsNotEmpty()
    userId: string;
  }
  