import { CircuitBreakerClient } from '@clients/circuit-breaker.client';
import { AxiosResponse } from 'axios';
import CircuitBreaker from 'opossum';
import { BaseApi } from './base.api';

export class ExternalsApi extends BaseApi {
    private _baseUrl = process.env.EXTERNAL_URL || '';
    private _circuitName = ExternalsApi.name;
    private static _circuit: CircuitBreaker;

    constructor() {
        super();
    }

    async postExternal() {
        ExternalsApi._circuit = ExternalsApi._circuit ?? (await new CircuitBreakerClient(this._circuitName, this.post).init());

        try {
            const result = (await ExternalsApi._circuit.fire(this._baseUrl, '')) as AxiosResponse<any, any>;

            console.log(result);

            return result.data;
        } catch (error) {
            console.log(error);

            throw error;
        }
    }
}
