import type { Request, Response } from "express";
import type { JSONSchemaType } from "ajv";
import type UserService from "@/services/UserService.js";
import ajv from "@/ajv.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";

const getUserReqParamsSchema: JSONSchemaType<{ id: string }> = {
    type: "object",
    properties: {
        id: {
            type: "string",
            format: "uuid",
        },
    },
    required: ["id"],
    additionalProperties: false,
};

const getUserReqParams = ajv.compile(getUserReqParamsSchema);

export default class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getById(req: Request, res: Response) {
        if (!getUserReqParams(req.params)) {
            throw new ValidationError(getUserReqParams.errors);
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
