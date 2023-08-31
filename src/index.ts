import { Server } from "http";
import { getConfig } from "./config/config";
import app from "./services/express";
import { dbConnect } from "./services/mongo";
const port: string = getConfig('PORT')
// dbConnect()
export const start: Server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

start
