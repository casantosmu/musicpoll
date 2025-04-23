import type { Request, Response } from "express";
import UnauthorizedError from "@/errors/UnauthorizedError.js";

export default class UserController {
    me(req: Request, res: Response) {
        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        res.status(200).json({ data: req.session.user });
    }
}
