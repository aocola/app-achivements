import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login-user.http.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/users/domain/entities/user.entity';
import { LoginUserService } from 'src/users/applicatiton/use-case/login-user.service';


@Controller('users')
export class LoginUserController {
    constructor(private service: LoginUserService){}

    @Post('login')
    async run(@Body() dto: LoginDto): Promise<object> {
        try {
            const data = await this.service.execute(dto.userId, dto.password);
            return ResponseDto.success<object>(data, "Operación satisfactoria", HttpStatus.ACCEPTED);
        } catch (error) {
            return ResponseDto.error<object>("Error en login", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}