import { Router } from 'express';
import V1Routes from './v1';

const apiRoutes = Router();

apiRoutes.use('/v1', V1Routes);

export default apiRoutes;
