import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; 

@Schema({ timestamps: true })
export class Medalla {
    @Prop({ required: true, unique: true, default: () => uuidv4()}) // ID único para Medalla
    medallaId: string;

    @Prop({ required: true }) // Relación con User
    userId: string;

    @Prop({ required: true }) // Tipo de medalla
    tipo: string; // Ejemplo: MADERA, HIERRO, etc.

    @Prop({ required: true, default: 'NO_VERIFICADA' }) // Estado de la medalla
    status: 'NO_VERIFICADA' | 'VERIFICADA' | 'BLOQUEADA' ;
}

export const MedallaSchema = SchemaFactory.createForClass(Medalla);

export type MedallaDocument = HydratedDocument<Medalla>;
