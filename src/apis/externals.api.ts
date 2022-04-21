import BaseApi from './base.api';

export class ExternalsApi extends BaseApi {
    constructor() {
        super(process.env.EXTERNAL_URL!);
    }

    async postExtrenal() {
        const { data } = await this.post('');

        return data;
    }
}
