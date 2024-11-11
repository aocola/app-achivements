import { Cliente } from "../entities/client.entity";

export abstract class CustomerRepository {
    abstract insertAll(clientes: Cliente[]): Promise<Cliente[]>;
}