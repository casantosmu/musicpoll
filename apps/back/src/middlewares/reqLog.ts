import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";
import type Logger from "@/Logger.js";

export default function reqLog(logger: Logger): RequestHandler {
    return (req, res, next) => {
        const startTime = Date.now();
        req.logger = logger.child({ reqId: randomUUID() });

        res.on("finish", () => {
            const time = Date.now() - startTime;
            const status = res.statusCode;
            req.logger.info(`${req.method} ${req.url} | ${req.ip} | ${status} | ${time}ms`);
        });

        next();
    };
}
