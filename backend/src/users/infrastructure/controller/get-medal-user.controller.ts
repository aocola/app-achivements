import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ResponseDto } from "src/common/dto/response.dto";
import { GetMedalsByUserService } from "src/users/applicatiton/use-case/get-medals-user.service";
import { GetMedalsByUserIdDto } from "./dto/get-medals-user.http.dto";

@Controller("users")
export class GetMedalByUserController {
    constructor(private service: GetMedalsByUserService){}

    @Get("medals/:id")
    async run(@Param() dto:GetMedalsByUserIdDto):Promise<object>{
        try {
            const data = await this.service.execute(dto.id);
            return ResponseDto.success(data,"Operacion satisfactoria", HttpStatus.FOUND);
        } catch (error) {
            return ResponseDto.error("Error en obtener medallas", error, HttpStatus.BAD_REQUEST);
        }
    }
}