
export interface AdminAttributes {
    adminId: string;
    name: string;
    email: string;
    password?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class Admin {
    constructor(private attributes: AdminAttributes) {}

    static create(createAdmin: {
        adminId: string;
        name: string;
        email: string;
        password?: string;
        isActive: boolean;
    }): AdminAttributes {
        return {
            adminId: createAdmin.adminId,
            name: createAdmin.name,
            email: createAdmin.email,
            password: createAdmin.password,
            isActive: createAdmin.isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    toValue(): AdminAttributes {
        return this.attributes;
    }
}
