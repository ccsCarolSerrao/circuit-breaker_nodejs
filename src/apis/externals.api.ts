import { CircuitBreakerClient } from '@clients/circuit-breaker.client';
import CircuitBreaker from 'opossum';
import { BaseApi } from './base.api';

export class ExternalsApi extends BaseApi {
    private _baseUrl = process.env.EXTERNAL_URL || '';
    private static _circuitName = ExternalsApi.name;
    private static _circuitInstance: CircuitBreaker;

    constructor() {
        super();
    }

    private static getCircuitInstance() {
        ExternalsApi._circuitInstance = ExternalsApi._circuitInstance ?? new CircuitBreakerClient(ExternalsApi._circuitName).init();

        return ExternalsApi._circuitInstance;
    }

    @CircuitBreakerClient.circuitFire(ExternalsApi.getCircuitInstance())
    async postExternal() {
        try {
            const { data } = await this.post(this._baseUrl, '');

            return data;
        } catch (exception) {
            throw exception;
        }
    }
}
