import type { NextFunction, Request, Response } from "express";
import UnauthorizedError from "@/errors/UnauthorizedError.js";

export default class AuthController {
    logout(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        req.session.destroy((error) => {
            if (error) {
                next(error);
            } else {
                res.status(204).end();
            }
        });
    }
}
