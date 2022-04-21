import { CustomError } from '../customError';
import { HttpStatusCode } from '../enums';

export class UnauthorizedException extends CustomError {
    constructor(message?: string) {
        super(HttpStatusCode.UNAUTHORIZED, message);
    }
}
