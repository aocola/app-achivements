import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateUserService } from 'src/users/applicatiton/use-case/create-user.service';
import { CreateUserHttpDto } from './dto/create-user-http.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/users/domain/entities/user.entity';
import { GetMedalsByUserIdDto } from './dto/get-medals-user.http.dto';
import { GetDetailMedalService } from 'src/users/applicatiton/use-case/get-detail-medal.service';


@Controller('users')
export class GetDetailMedalController {
    constructor(private service: GetDetailMedalService){}

    @Get("medal/:id")
    async run(@Param() dto:GetMedalsByUserIdDto):Promise<object>{
        try {
            const data = await this.service.execute(dto.id);
            return ResponseDto.success(data,"Operacion satisfactoria", HttpStatus.FOUND);
        } catch (error) {
            return ResponseDto.error("Error en obtener medallas", error, HttpStatus.BAD_REQUEST);
        }
    }
}


