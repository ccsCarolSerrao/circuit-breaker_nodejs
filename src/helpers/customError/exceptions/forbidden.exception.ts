import { CustomError } from '../customError';
import { HttpStatusCode } from '../enums';

export class ForbiddenException extends CustomError {
    constructor(message?: string) {
        super(HttpStatusCode.FORBIDDEN, message);
    }
}
