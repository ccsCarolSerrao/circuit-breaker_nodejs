import { ExternalsApi } from '@apis/externals.api';
import { InternalServerErrorException } from '@helpers/customError/exceptions/internalServerError.exception';

export class ExternalsService {
    async postExternal() {
        try {
            const api = new ExternalsApi();

            return await api.postExternal();
        } catch (error) {
            throw new InternalServerErrorException(error as string);
        }
    }
}
