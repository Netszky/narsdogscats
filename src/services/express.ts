import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRouter from '../routes/index';

dotenv.config();

const app: Express = express();
const port: String = process.env.PORT!;

app.use("*", cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/v1/', apiRouter);

export const start: Server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });

// export default app;