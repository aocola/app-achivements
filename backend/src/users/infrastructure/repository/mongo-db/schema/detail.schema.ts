import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; 

@Schema({ timestamps: true })
export class Detalle {
    @Prop({ required: true, unique: true, default: () => uuidv4() }) // ID único para Detalle
    detalleId: string;

    @Prop({ required: true }) // Relación con User
    userId: string;

    @Prop({ required: false })
    medal: string;

    @Prop({ required: true, default: 'PENDING' }) // Estado de la solicitud
    status: 'PENDING' | 'APPROVED' | 'REJECTED';

    @Prop({required: true, default: 0})
    counter: number;
}

export const DetalleSchema = SchemaFactory.createForClass(Detalle);

export type DetalleDocument = HydratedDocument<Detalle>;
