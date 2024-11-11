import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GetDetallesByUserIdDto } from './dto/get-detail-user.http.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Detalle } from 'src/users/domain/entities/detail.entity';
import { GetUserDetailService } from 'src/users/applicatiton/use-case/get-details-user.service';


@Controller('users')
export class GetUserDetailController {
    constructor(private service: GetUserDetailService){}

    @Get('detalle/:id')
    async run(@Param() dto: GetDetallesByUserIdDto): Promise<object> {
        try {
            const data = await this.service.execute(dto.id);
            return ResponseDto.success<object>(data, "Operación satisfactoria", HttpStatus.CREATED);
        } catch (error) {
            return ResponseDto.error<object>("Error en registro de usuario", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}