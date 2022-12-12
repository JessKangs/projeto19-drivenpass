import express, { Express } from "express";
import cors from "cors";
import { loadEnv } from "./config/envs";
import { connectDb, disconnectDB } from "./config/database";

loadEnv();

import {
    authenticationRouter,
    credentialsRouter,
    networksRouter
} from "./routers"

const app = express();
app
.use(cors())
.use(express.json())
.use("/auth", authenticationRouter)
.use("/credentials", credentialsRouter)
.use("/networks", networksRouter)

export function init(): Promise<Express>{
    connectDb();
    return Promise.resolve(app);
}

export async function close(): Promise<void> {
    await disconnectDB();
}

export default app;
