import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; 

@Schema({ timestamps: true })
export class Cliente {

    @Prop({required: true, unique: true, default: () => uuidv4() })
    clienteId: string;

    @Prop({ required: true }) // DNI del cliente
    dni: string;

    @Prop({ required: true }) // Nombre del cliente
    nombre: string;

    @Prop({ required: true }) // Apellidos del cliente
    apellidos: string;

    @Prop({ required: true }) // Correo del cliente
    correo: string;

    @Prop({ required: true }) // Relación con detalle
    detalleId: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);

export type ClienteDocument = HydratedDocument<Cliente>;
