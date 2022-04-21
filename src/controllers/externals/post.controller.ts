import { ExternalsService } from '@services/externals.service';
import { Request, Response } from 'express';

export default async function postExternalController(request: Request, response: Response) {
    const service = new ExternalsService();
    const result = await service.postExternal();

    return response.json(result);
}
