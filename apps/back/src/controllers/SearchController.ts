import type { Request, Response } from "express";
import type Validator from "@/Validator.js";
import type SpotifyService from "@/services/SpotifyService.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";

export default class SearchController {
    private readonly validator: Validator;
    private readonly spotifyService: SpotifyService;

    constructor(validator: Validator, spotifyService: SpotifyService) {
        this.validator = validator;
        this.spotifyService = spotifyService;
    }

    async searchSongs(req: Request, res: Response) {
        const validation = this.validator.get("searchSongsReqQuery");
        if (!validation(req.query)) {
            throw new ValidationError(validation.errors);
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
