export interface DetalleAttributes {
    detalleId: string;
    userId: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    counter: number;
    medal: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Detalle {
    constructor(private attributes: DetalleAttributes) {}

    static create(createDetalle: {
        userId: string;
        counter: number;
        status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    }): Detalle {
        const detalleAttributes = {
            userId: createDetalle.userId,
            status: createDetalle.status || 'PENDING',
            counter: createDetalle.counter,
            medal: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Partial<DetalleAttributes>; // No incluye detalleId si no está definido

        return new Detalle(detalleAttributes as DetalleAttributes);
    }

    toValue(): DetalleAttributes {
        return this.attributes;
    }

    withGeneratedId(detalleId: string): DetalleAttributes {
        return {
            ...this.attributes,
            detalleId,
        };
    }
    approve(){
        if (this.attributes.status !== 'PENDING') {
            throw new Error('Solo se puede aprobar detalles pendientes.');
        }
        this.attributes.status="APPROVED";
        this.attributes.updatedAt = new Date();
    }
    reject(){
        if (this.attributes.status !== 'PENDING') {
            throw new Error('Solo se puede rechazar detalles pendientes.');
        }
        this.attributes.status="REJECTED";
        this.attributes.updatedAt = new Date();
    }
    retry(): void {
        if (this.attributes.status !== 'REJECTED') {
            throw new Error('Solo se pueden reintentar detalles rechazados.');
        }
        this.attributes.status = 'PENDING';
        this.attributes.updatedAt = new Date();
    }

    
    setMedal(medal: string):void{
        if(medal.length>0)
            this.attributes.medal=medal;
    }
}

