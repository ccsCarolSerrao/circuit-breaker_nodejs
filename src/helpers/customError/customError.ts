import { HttpStatusCode } from './enums';

/* eslint-disable */
export function fixProto(target: Error, prototype: {}) {
    const { setPrototypeOf } = Object as any;
    setPrototypeOf ? setPrototypeOf(target, prototype) : ((target as any).__proto__ = prototype);
}

export function fixStack(target: Error, fn: Function = target.constructor) {
    const { captureStackTrace } = Error as any;
    captureStackTrace && captureStackTrace(target, fn);
}

export class CustomError extends Error {
    constructor(public statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, message?: string) {
        super(message);

        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
            configurable: true,
        });

        fixProto(this, new.target.prototype);

        fixStack(this);

        let exception = {
            stack: this.stack,
            name: this.name,
        };
        console.error(`${this.message}`, {
            exception,
            action: this.name,
            statusCode: this.statusCode,
            statusType: 'exception',
        });
    }
}
