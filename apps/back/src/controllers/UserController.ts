import type { Request, Response } from "express";
import UnauthorizedError from "@/errors/UnauthorizedError.js";

export default class UserController {
    me(req: Request, res: Response) {
        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        const user = {
            id: req.session.user.id,
        };

        res.status(200).json({ data: user });
    }
}
