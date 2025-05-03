import type { NextFunction, Request, Response } from "express";
import type Logger from "@/Logger.js";
import type AppConfig from "@/config/AppConfig.js";
import type UserService from "@/services/UserService.js";
import type SpotifyService from "@/services/SpotifyService.js";

export default class SpotifyAuthController {
    private readonly logger: Logger;
    private readonly appConfig: AppConfig;
    private readonly userService: UserService;
    private readonly spotifyService: SpotifyService;

    constructor(logger: Logger, appConfig: AppConfig, userService: UserService, spotifyService: SpotifyService) {
        this.logger = logger.child({ name: this.constructor.name });
        this.appConfig = appConfig;
        this.userService = userService;
        this.spotifyService = spotifyService;
    }

    login(req: Request, res: Response) {
        res.redirect(this.spotifyService.buildAuthUrl());
    }

    async callback(req: Request, res: Response, next: NextFunction) {
        const error = req.query.error;
        const code = req.query.code;

        if (typeof error === "string") {
            this.logger.error(`Error received from Spotify authorization: ${error}`);
            res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=false`);
            return;
        }

        if (typeof code !== "string") {
            this.logger.error("Unexpected error: Missing code from Spotify authorization");
            res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=false`);
            return;
        }

        const tokens = await this.spotifyService.getAccessToken(code);
        const me = await this.spotifyService.getMe(tokens.accessToken);
        const user = await this.userService.upsert({
            email: me.email,
            displayName: me.displayName,
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
                res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=true`);
            }
        });
    }
}
