import type { Request, Response } from "express";
import type { JSONSchemaType } from "ajv";
import type SpotifyService from "@/services/SpotifyService.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";
import ajv from "@/ajv.js";

const searchSongsReqQuerySchema: JSONSchemaType<{
    q: string;
    limit?: number;
    offset?: number;
}> = {
    type: "object",
    properties: {
        q: {
            type: "string",
        },
        limit: {
            type: "integer",
            minimum: 0,
            maximum: 50,
            nullable: true,
        },
        offset: {
            type: "integer",
            minimum: 0,
            maximum: 1000,
            nullable: true,
        },
    },
    required: ["q"],
    additionalProperties: false,
};

const searchSongsReqQuery = ajv.compile(searchSongsReqQuerySchema);

export default class SearchController {
    private readonly spotifyService: SpotifyService;

    constructor(spotifyService: SpotifyService) {
        this.spotifyService = spotifyService;
    }

    async searchSongs(req: Request, res: Response) {
        if (!searchSongsReqQuery(req.query)) {
            throw new ValidationError(searchSongsReqQuery.errors);
        }

        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        const result = await this.spotifyService.searchSongs({
            userId: req.session.user.id,
            q: req.query.q,
            limit: req.query.limit,
            offset: req.query.offset,
        });
        res.status(200).json(result);
    }
}
