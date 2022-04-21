import postExternalController from '@controllers/externals/post.controller';
import { Router } from 'express';

const externalRoutes = Router();

externalRoutes.post('/', postExternalController);

export default externalRoutes;
