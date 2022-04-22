import { CustomError } from '@helpers/customError/customError';
import { HttpStatusCode } from '@helpers/customError/enums';
import { ExternalsService } from '@services/externals.service';
import { Request, Response } from 'express';

export default async function postExternalController(_request: Request, response: Response) {
    const service = new ExternalsService();

    try {
        const result = await service.postExternal();

        return response.json(result);
    } catch (error) {
        const { message, statusCode } = error as CustomError;

        return response.status(statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: message });
    }
}
