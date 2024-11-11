export interface ClienteAttributes {
    dni: string;
    nombre: string;
    apellidos: string;
    correo: string;
    detalleId: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Cliente {
    constructor(private attributes: ClienteAttributes) {}

    static create(createCliente: {
        dni: string;
        nombre: string;
        apellidos: string;
        correo: string;
        detalleId: string;
    }): Cliente {
        const clienteAttr =  {
            dni: createCliente.dni,
            nombre: createCliente.nombre,
            apellidos: createCliente.apellidos,
            correo: createCliente.correo,
            detalleId: createCliente.detalleId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return new Cliente(clienteAttr);
    }

    toValue(): ClienteAttributes {
        return this.attributes;
    }
}
