/* eslint-disable no-console */
import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import routes from '@routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(routes);

app.listen(port, () => console.log(`🚀 Server ready at http://0.0.0.0:${port}`));
