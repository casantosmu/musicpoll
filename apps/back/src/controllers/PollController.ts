import type { Request, Response } from "express";
import type Validator from "@/Validator.js";
import type PollService from "@/services/PollService.js";
import type SpotifyService from "@/services/SpotifyService.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";

export default class PollController {
    private readonly validator: Validator;
    private readonly pollService: PollService;
    private readonly spotifyService: SpotifyService;

    constructor(validator: Validator, pollService: PollService, spotifyService: SpotifyService) {
        this.validator = validator;
        this.pollService = pollService;
        this.spotifyService = spotifyService;
    }

    async get(req: Request, res: Response) {
        const validation = this.validator.get("getPollReqParams");
        if (!validation(req.params)) {
            throw new ValidationError(validation.errors);
        }

        const poll = await this.pollService.getById(req.params.id);
        res.status(200).json({ data: poll });
    }

    async create(req: Request, res: Response) {
        const validation = this.validator.get("createPollReqBody");
        if (!validation(req.body)) {
            throw new ValidationError(validation.errors);
        }

        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        const user = req.session.user;

        const playlistResult = await this.spotifyService.createPlaylist({
            userId: user.id,
            spotifyUserId: user.spotifyAccount.userId,
            name: req.body.title,
            description: req.body.description,
            trackIds: req.body.songs.map((song) => song.id),
        });

        const poll = await this.pollService.create({
            ...req.body,
            songs: req.body.songs.map((song) => ({
                ...song,
                spotifySongId: song.id,
            })),
            userId: user.id,
            spotifyPlaylistId: playlistResult.id,
        });
        res.status(201).json({ data: poll });
    }

    async vote(req: Request, res: Response) {
        const validation = this.validator.get("voteReqBody");
        if (!validation(req.body)) {
            throw new ValidationError(validation.errors);
        }

        if (!req.session.user) {
            throw new UnauthorizedError();
        }

        await this.pollService.vote(req.session.user.id, req.body);

        res.status(204).end();
    }

    async result(req: Request, res: Response) {
        const validation = this.validator.get("getPollResultReqParams");
        if (!validation(req.params)) {
            throw new ValidationError(validation.errors);
        }

        const result = await this.pollService.getResultByPollId(req.params.id);

        res.status(200).json({ data: result });
    }
}
