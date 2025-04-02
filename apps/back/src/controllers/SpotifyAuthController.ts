import type { NextFunction, Request, Response } from "express";
import type Logger from "@/Logger.js";
import type UserService from "@/services/UserService.js";
import type SpotifyService from "@/services/SpotifyService.js";

const FRONTEND_BASEURL = "http://localhost:5173";

export default class SpotifyAuthController {
    private readonly logger: Logger;
    private readonly userService: UserService;
    private readonly spotifyService: SpotifyService;

    constructor(logger: Logger, userService: UserService, spotifyService: SpotifyService) {
        this.logger = logger.child({ scope: this.constructor.name });
        this.userService = userService;
        this.spotifyService = spotifyService;
    }

    spotifyLogin(req: Request, res: Response) {
        res.redirect(this.spotifyService.buildAuthUrl());
    }

    async spotifyCallback(req: Request, res: Response, next: NextFunction) {
        const error = req.query.error;
        const code = req.query.code;

        if (typeof error === "string") {
            this.logger.error(`Error received from Spotify authorization: ${error}`);
            res.redirect(`${FRONTEND_BASEURL}/login?success=false`);
            return;
        }

        if (typeof code !== "string") {
            this.logger.error("Unexpected error: Missing code from Spotify authorization");
            res.redirect(`${FRONTEND_BASEURL}/login?success=false`);
            return;
        }

        const tokens = await this.spotifyService.getAccessToken(code);
        const me = await this.spotifyService.getMe(tokens.accessToken);
        const user = await this.userService.create({
            email: me.email,
            spotifyAccount: {
                userId: me.id,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresAt: tokens.expiresAt,
            },
        });

        req.session.user = user;
        req.session.save((error) => {
            if (error) {
                next(error);
            } else {
                res.redirect(`${FRONTEND_BASEURL}/login?success=true`);
            }
        });
    }
}
