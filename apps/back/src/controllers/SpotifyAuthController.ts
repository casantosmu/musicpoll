import type { Request, Response } from "express";
import type Logger from "@/Logger.js";
import BadRequestError from "@/errors/BadRequestError.js";
import SpotifyAuthService from "@/services/SpotifyAuthService.js";

export default class SpotifyAuthController {
    private readonly logger: Logger;
    private readonly spotifyAuthService: SpotifyAuthService;

    constructor(logger: Logger, spotifyAuthService: SpotifyAuthService) {
        this.logger = logger.child({ scope: this.constructor.name });
        this.spotifyAuthService = spotifyAuthService;
    }

    spotifyLogin(req: Request, res: Response) {
        res.redirect(this.spotifyAuthService.buildAuthUrl());
    }

    async spotifyCallback(req: Request, res: Response) {
        const error = req.query.error;
        const code = req.query.code;

        if (typeof error === "string") {
            this.logger.error(`Error received from Spotify authorization: ${error}`);
            throw new BadRequestError("Spotify authorization failed");
        }

        if (typeof code !== "string") {
            this.logger.error("Unexpected error: Missing code from Spotify authorization");
            throw new BadRequestError("Unexpected authorization response from Spotify: Missing code");
        }

        const { accessToken, refreshToken } = await this.spotifyAuthService.getAccessToken(code);
        res.status(200).send({ data: { accessToken, refreshToken } });
    }
}
