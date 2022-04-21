import { CustomError } from '../customError';
import { HttpStatusCode } from '../enums';

export class BadRequestException extends CustomError {
    constructor(message?: string) {
        super(HttpStatusCode.BAD_REQUEST, message);
    }
}
