import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateUserService } from 'src/users/applicatiton/use-case/create-user.service';
import { CreateUserHttpDto } from './dto/create-user-http.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/users/domain/entities/user.entity';


@Controller('users')
export class CreateUserController {
    constructor(private service: CreateUserService){}

    @Post('register')
    async run(@Body() dto: CreateUserHttpDto): Promise<object> {
        try {
            const data = await this.service.execute(dto);
            return ResponseDto.success<object>(data, "Operación satisfactoria", HttpStatus.CREATED);
        } catch (error) {
            return ResponseDto.error<object>("Error en registro de usuario", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}


