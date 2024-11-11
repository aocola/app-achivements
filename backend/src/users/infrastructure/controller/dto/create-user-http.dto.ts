import {
  IsNotEmpty,
  IsStrongPassword,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateUserHttpDto {
  @IsString() 
  @IsNotEmpty()
  name: string;

  
  @Matches(/^[a-zA-Z0-9]+$/)
  @IsNotEmpty()
  userId: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
}
