export interface MedallaAttributes {
    medallaId: string;
    userId: string;
    tipo: string; // Ejemplo: MADERA, HIERRO, etc.
    status: 'NO_VERIFICADA' | 'VERIFICADA'  | 'BLOQUEADA';
    createdAt: Date;
    updatedAt: Date;
}

export class Medalla {
    constructor(private attributes: MedallaAttributes) {}

    static create(createMedalla: {
        userId: string;
        tipo: string;
        status?: 'NO_VERIFICADA' | 'VERIFICADA'  | 'BLOQUEADA';
    }): Medalla {
        const medallaAttributes = {
            userId: createMedalla.userId,
            tipo: createMedalla.tipo,
            status: createMedalla.status || 'NO_VERIFICADA',
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Partial<MedallaAttributes>;
        return new Medalla(medallaAttributes as MedallaAttributes);
    }

    toValue(): MedallaAttributes {
        return this.attributes;
    }

    verify(): void {
        if (this.attributes.status === 'NO_VERIFICADA' ||  this.attributes.status == 'BLOQUEADA') {
            this.attributes.status = 'VERIFICADA';
            this.attributes.updatedAt = new Date();
        } else {
            throw new Error(`La medalla no está en estado NO_VERIFICADA. Estado actual: ${this.attributes.status}`);
        }
    }
    block(): void {
        if (this.attributes.status !== 'BLOQUEADA') {
            this.attributes.status = 'BLOQUEADA';
            this.attributes.updatedAt = new Date();
        }
    }

    notVerify():void{
        if (this.attributes.status === 'BLOQUEADA') {
            this.attributes.status = 'NO_VERIFICADA';
            this.attributes.updatedAt = new Date();
        }
    }

    unlock(): void {
        if (this.attributes.status === 'BLOQUEADA') {
            this.attributes.status = 'NO_VERIFICADA';
            this.attributes.updatedAt = new Date(); // Actualizar la fecha de modificación
        } else {
            throw new Error(`La medalla no está en estado BLOQUEADA. Estado actual: ${this.attributes.status}`);
        }
    }


    changeStatus(newStatus: 'NO_VERIFICADA' | 'VERIFICADA' | 'BLOQUEADA'): void {
        if (this.attributes.status !== newStatus) {
            this.attributes.status = newStatus;
            this.attributes.updatedAt = new Date(); // Actualizar la fecha de modificación
        }
    }
}
