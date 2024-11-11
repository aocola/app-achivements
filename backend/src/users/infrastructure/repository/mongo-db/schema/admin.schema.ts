import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Admin {
    @Prop({ required: true, unique: true }) // ID único para Admin
    adminId: string;

    @Prop({ required: true }) // Nombre del administrador
    name: string;

    @Prop({ required: true, unique: true }) // Correo único
    email: string;

    @Prop({ required: true, select: false }) // Contraseña no visible en consultas por defecto
    password: string;

    @Prop({ default: true }) // Estado activo del administrador
    isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

export type AdminDocument = HydratedDocument<Admin>;