import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true }) // userId es un campo único, no un _id
    userId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, select: false }) // La contraseña no se devuelve en las consultas por defecto
    password: string;

    @Prop({ required: true }) 
    role: string;

    @Prop({ required: true })
    lastDayLogin: Date;

    @Prop({ default: true }) // Estado activo del usuario
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;