import { Body, Controller, Get, HttpStatus } from "@nestjs/common";
import { DetalleRequestDto } from "./dto/detail-request.http.dto";
import { ResponseDto } from "src/common/dto/response.dto";
import { GetAllDetailService } from "src/users/applicatiton/use-case/get-all-details.service";




@Controller("users")
export class GetAllDetailController {
    constructor(private service: GetAllDetailService){}

    @Get("detalle")
    async run():Promise<object>{
        try {
            const data = await this.service.execute()
            return ResponseDto.success<object>(data, "Operación satisfactoria", HttpStatus.ACCEPTED);
        } catch (error) {
            return ResponseDto.error<object>("Error en obtener detalles", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}