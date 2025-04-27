import type { Request, Response } from "express";
import type { JSONSchemaType } from "ajv";
import type PollService from "@/services/PollService.js";
import ValidationError from "@/errors/ValidationError.js";
import ajv from "@/ajv.js";

const createPollReqBodySchema: JSONSchemaType<{
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

const createPollReqBody = ajv.compile(createPollReqBodySchema);

export default class PollController {
    private readonly pollService: PollService;

    constructor(pollService: PollService) {
        this.pollService = pollService;
    }

    async create(req: Request, res: Response) {
        if (!createPollReqBody(req.body)) {
            throw new ValidationError(createPollReqBody.errors);
        }

        const poll = await this.pollService.create(req.body);
        res.status(201).json({ data: poll });
    }
}
