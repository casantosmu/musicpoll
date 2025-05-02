import type { Request, Response } from "express";
import type Validator from "@/Validator.js";
import type UserService from "@/services/UserService.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";

export default class UserController {
    private readonly validator: Validator;
    private readonly userService: UserService;

    constructor(validator: Validator, userService: UserService) {
        this.validator = validator;
        this.userService = userService;
    }

    async getById(req: Request, res: Response) {
        const validation = this.validator.get("getUserReqParams");
        if (!validation(req.params)) {
            throw new ValidationError(validation.errors);
        }

        const user = await this.userService.getById(req.params.id);
        res.status(200).json({
            data: {
                id: user.id,
                displayName: user.displayName,
            },
        });
    }

    me(req: Request, res: Response) {
        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        const user = req.session.user;
        res.status(200).json({
            data: {
                id: user.id,
                displayName: user.displayName,
            },
        });
    }
}
