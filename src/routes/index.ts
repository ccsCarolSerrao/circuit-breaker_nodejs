import { Router } from 'express';
import apiRoutes from './api';
import healthController from '@controllers/health.controller';

const routes = Router();
routes.get('/health', healthController);

routes.use('/api', apiRoutes);

export default routes;
