import type { Request, Response } from "express";
import type { JSONSchemaType } from "ajv";
import type PollService from "@/services/PollService.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";
import ajv from "@/ajv.js";

const createPollReqBodySchema: JSONSchemaType<{
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
    songs: { id: string; title: string; artist: string; album: string; albumImg: string }[];
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
        songs: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                    },
                    title: {
                        type: "string",
                    },
                    artist: {
                        type: "string",
                    },
                    album: {
                        type: "string",
                    },
                    albumImg: {
                        type: "string",
                    },
                },
                required: ["id", "title", "artist", "album", "albumImg"],
                additionalProperties: false,
            },
        },
    },
    required: ["title", "description", "allowMultipleOptions", "songs"],
    additionalProperties: false,
};

const createPollReqBody = ajv.compile(createPollReqBodySchema);

const getPollReqParamsSchema: JSONSchemaType<{ id: string }> = {
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

const getPollReqParams = ajv.compile(getPollReqParamsSchema);

export default class PollController {
    private readonly pollService: PollService;

    constructor(pollService: PollService) {
        this.pollService = pollService;
    }

    async get(req: Request, res: Response) {
        if (!getPollReqParams(req.params)) {
            throw new ValidationError(getPollReqParams.errors);
        }

        const poll = await this.pollService.getById(req.params.id);
        res.status(200).json({ data: poll });
    }

    async create(req: Request, res: Response) {
        if (!createPollReqBody(req.body)) {
            throw new ValidationError(createPollReqBody.errors);
        }

        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        const poll = await this.pollService.create({
            ...req.body,
            songs: req.body.songs.map((song) => ({
                ...song,
                songId: song.id,
            })),
            userId: req.session.user.id,
        });
        res.status(201).json({ data: poll });
    }
}
