import { CustomError } from '../customError';
import { HttpStatusCode } from '../enums';

export class CircuitBreakerOpenrException extends CustomError {
    constructor(externalService: string) {
        const message = `Circuit Breaker is open to ${externalService} service`;
        super(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
    }
}
