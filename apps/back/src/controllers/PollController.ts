import type { NextFunction, Request, Response } from "express";
import type { JSONSchemaType } from "ajv";
import ajv from "@/ajv.js";
import type PollService from "@/services/PollService.js";

const CreatePollBodySchema: JSONSchemaType<{
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
}> = {
    type: "object",
    properties: {
        title: {
            type: "string",
        },
        description: {
            type: "string",
            nullable: true,
        },
        allowMultipleOptions: {
            type: "boolean",
        },
    },
    required: ["title", "description", "allowMultipleOptions"],
    additionalProperties: false,
};

const createPollBodyValidation = ajv.compile(CreatePollBodySchema);

export default class PollController {
    private readonly pollService: PollService;

    constructor(pollService: PollService) {
        this.pollService = pollService;
    }

    async create(req: Request, res: Response, next: NextFunction) {
        if (createPollBodyValidation(req.body)) {
            const result = await this.pollService.create(req.body);
            res.status(201).json({ data: result });
        } else {
            next(createPollBodyValidation.errors);
        }
    }
}
