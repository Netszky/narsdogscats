import { start } from "./services/express";
import { dbConnect } from "./services/mongo";
dbConnect()

start
