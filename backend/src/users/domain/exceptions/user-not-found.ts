export class UserNotFoundException extends Error{
    constructor(public readonly id:string){
        super(`Usuario no encontrado ${id}`);
    }
}