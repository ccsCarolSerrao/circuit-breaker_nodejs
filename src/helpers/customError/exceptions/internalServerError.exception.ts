import { CustomError } from '../customError';
import { HttpStatusCode } from '../enums';

export class InternalServerErrorException extends CustomError {
    constructor(message?: string) {
        super(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
    }
}
