import { BaseApi } from './base.api';
import { circuitFire } from '@decorators/circuit-breaker.decorator';

export class ExternalsApi extends BaseApi {
    private _baseUrl = process.env.EXTERNAL_URL || '';

    constructor() {
        super();
    }

    @circuitFire()
    async postExternal() {
        try {
            const { data } = await this.post(this._baseUrl, '');

            return data;
        } catch (exception) {
            throw exception;
        }
    }
}
