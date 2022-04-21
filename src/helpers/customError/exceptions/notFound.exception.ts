import { CustomError } from '../customError';
import { HttpStatusCode } from '../enums';

export class NotFoundException extends CustomError {
    constructor(message?: string) {
        super(HttpStatusCode.NOT_FOUND, message);
    }
}
