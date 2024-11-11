export class UserAlreadyExistsException extends Error{
    constructor(userId: string){
        super(`Usuario ya existe ${userId}`);
    }
}