import { Body, Controller, HttpStatus, Post, Put } from "@nestjs/common";
import { DetalleRequestDto } from "./dto/detail-request.http.dto";
import { ResponseDto } from "src/common/dto/response.dto";
import { RetryDetailService } from "src/users/applicatiton/use-case/retry-detail.service";




@Controller("users")
export class RetryDetailController {
    constructor(private service:RetryDetailService){}

    @Put("detalle/reintentar")
    async run(@Body() dto: DetalleRequestDto):Promise<object>{
        try {
            const status = await this.service.execute(dto.id);
            return ResponseDto.success<boolean>(status, "Operación satisfactoria", HttpStatus.ACCEPTED);
        } catch (error) {
            return ResponseDto.error<boolean>("Error en reintento de detalle", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}