export class InvalidPasswordException extends Error{
    constructor(){
        super(`Contraseña Inválida`);
    }
}