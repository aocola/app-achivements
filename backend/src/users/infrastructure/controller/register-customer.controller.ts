import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { CreateClientesBatchDto } from "./dto/create-client-batch-http.dto";
import { ResponseDto } from "src/common/dto/response.dto";
import { RegisterCustomerService } from "src/users/applicatiton/use-case/register-customers.service";


@Controller("users")
export class RegisterCustomerController {
    constructor(private service: RegisterCustomerService){}

    @Post("customers")
    async execute(@Body() dto:CreateClientesBatchDto):Promise<object> {
        try {
            await this.service.execute(dto.userId, dto.clientes); 
            return ResponseDto.success<boolean>(true, "Operación satisfactoria", HttpStatus.CREATED);
        } catch (error) {
            return ResponseDto.error<boolean>("Error en registro de clientes", error.message, HttpStatus.BAD_REQUEST);
        }
    }
}