import type { Express, Request, Response, NextFunction } from "express";
import HttpError from "@/errors/HttpError.js";
import NotFoundError from "@/errors/NotFoundError.js";

export default function errorHandler(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new NotFoundError());
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof HttpError) {
            req.logger.warn("HTTP error", error);
            res.status(error.status).json({ message: error.message });
        } else {
            req.logger.error("UNKNOWN error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
