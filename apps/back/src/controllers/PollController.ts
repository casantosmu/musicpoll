import type { Request, Response } from "express";
import type Validator from "@/Validator.js";
import type PollService from "@/services/PollService.js";
import UnauthorizedError from "@/errors/UnauthorizedError.js";
import ValidationError from "@/errors/ValidationError.js";

export default class PollController {
    private readonly validator: Validator;
    private readonly pollService: PollService;

    constructor(validator: Validator, pollService: PollService) {
        this.validator = validator;
        this.pollService = pollService;
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
}
