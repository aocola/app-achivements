import { Body, Controller, HttpStatus, Post, Put } from "@nestjs/common";
import { DetalleRequestDto } from "./dto/detail-request.http.dto";
import { ResponseDto } from "src/common/dto/response.dto";
import { AcceptDetailService } from "src/users/applicatiton/use-case/accept-detail.service";




@Controller("users")
export class AcceptDetailController {
    constructor(private service: AcceptDetailService){}

    @Put("detalle/aceptar")
    async run(@Body() dto: DetalleRequestDto):Promise<object>{
        try {
            await this.service.execute(dto.id);
            return ResponseDto.success<boolean>(true, "Operación satisfactoria", HttpStatus.ACCEPTED);
        } catch (error) {
            return ResponseDto.error<boolean>("Error en aceptar detalle", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}