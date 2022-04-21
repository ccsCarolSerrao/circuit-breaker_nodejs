import { CustomError } from '../customError';

export class HttpRequestException extends CustomError {
    public errorMessage?: string;

    constructor(statusCode: number, url: string, errorMessage?: string) {
        const message = `Error when calling the API: ${url}`;

        super(statusCode, message);

        this.errorMessage = errorMessage;
    }
}
