import type { NextFunction, Request, Response } from "express";
import UnauthorizedError from "@/errors/UnauthorizedError.js";

export default class UserController {
    me(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            res.status(200).json(req.session.user);
        } else {
            next(new UnauthorizedError());
        }
    }
}
