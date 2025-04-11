import type { NextFunction, Request, Response } from "express";
import UnauthorizedError from "@/errors/UnauthorizedError.js";

export default class UserController {
    me(req: Request, res: Response, next: NextFunction) {
        if (!req.session.user) {
            next(new UnauthorizedError());
            return;
        }
        res.status(200).json(req.session.user);
    }
}
