import dotenv from 'dotenv';
import express, { Express, } from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRouter from '../routes/index';
import cloudinary from 'cloudinary';

dotenv.config();

const app: Express = express();
const port: string = process.env.PORT!;

const corsOptions = {
  origin: ['https://les-animaux-du-27.fr', 'https://www.les-animaux-du-27.fr', 'http://localhost:3000'],
  // origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/v1', apiRouter);
cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
})

export const start: Server = app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
