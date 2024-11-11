export class DetailNotFoundException extends Error{
    constructor(public readonly id:string){
        super(`Detalle no encontrado ${id}`);
    }
}