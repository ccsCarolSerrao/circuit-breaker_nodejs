import { Router } from 'express';
import externalRoutes from './external';

const v1Routes = Router();

v1Routes.use('/externals', externalRoutes);

export default v1Routes;
