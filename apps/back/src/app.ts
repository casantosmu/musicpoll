import express from "express";
import type Logger from "@/Logger.js";
import reqLog from "@/middlewares/reqLog.js";

interface Parameters {
    logger: Logger;
}

export default function app({ logger }: Parameters) {
    const app = express();

    app.use(reqLog(logger));

    return app;
}
