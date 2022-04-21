import { ExternalsApi } from '@apis/externals.api';

export class ExternalsService {
    async postExternal() {
        const api = new ExternalsApi();

        return await api.postExtrenal();
    }
}
