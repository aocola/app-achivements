import { Cliente } from "../entities/client.entity";

export interface CustomerRepository {
    insertAll(clientes: Cliente[]): Promise<Cliente[]>;
}