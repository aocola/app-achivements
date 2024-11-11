import { InjectModel } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CustomInjectable } from "src/common/dependecy-injection/injectable";
import { Cliente, ClienteAttributes } from "src/users/domain/entities/client.entity";
import { CustomerRepository } from "src/users/domain/repository/customers.repository";



@CustomInjectable()
export class MongoCustomerRepository implements CustomerRepository {

    constructor(
        @InjectModel(Cliente.name) private customerModel: Model<HydratedDocument<ClienteAttributes>>
    ) {}
    
    async insertAll(clientes: Cliente[]): Promise<Cliente[]> {
        const customers = await this.customerModel.insertMany(clientes.map(item=>item.toValue()));
        return customers.map(item => this.mapToEntity(item));
    }

    private mapToEntity(document: HydratedDocument<ClienteAttributes>): Cliente {
        const clienteAttributes: ClienteAttributes = {
            detalleId: document.detalleId,
            dni: document.dni,
            nombre: document.nombre,
            apellidos: document.apellidos,
            correo: document.correo,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };
        return new Cliente(clienteAttributes);
    }
}