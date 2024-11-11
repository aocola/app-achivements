export interface UserAttributes {
    userId: string;
    name: string;
    password?: string;
    role: string;
    lastDayLogin: Date;
    isActive: boolean;
}

export class User {
    constructor(private attributes: UserAttributes) {}

    // Método estático para crear un nuevo usuario
    static create(createUser: {
        userId: string;
        name: string;
        password?: string;
    }): User {
        const userAttributes: UserAttributes = {
            userId: createUser.userId,
            name: createUser.name,
            password: createUser.password,
            role: "USER",
            lastDayLogin: new Date(), 
            isActive: true,
        };
        return new User(userAttributes);
    }

    // Método para marcar un inicio de sesión exitoso
    updateLastLogin(): void {
        this.attributes.lastDayLogin = new Date();
    }

    // Método para desactivar un usuario
    deactivate(): void {
        this.attributes.isActive = false;
    }

    // Método para retornar los valores del usuario
    toValue(): UserAttributes {
        return {
            userId: this.attributes.userId,
            name: this.attributes.name,
            password: this.attributes.password,
            role: this.attributes.role,
            lastDayLogin: this.attributes.lastDayLogin,
            isActive: this.attributes.isActive,
        };
    }

    // Método para ocultar información sensible
    toPublicValue(): Omit<UserAttributes, 'password'> {
        const { password, ...publicAttributes } = this.attributes;
        return publicAttributes;
    }
}
