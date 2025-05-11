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
        const state = this.spotifyService.generateState(16);
        req.session.spotifyAuthState = state;

        req.session.save((error) => {
            if (error) {
                this.logger.error("Error saving session before Spotify login redirect:", error);
                res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=false&error=session_error`);
                return;
            }
            res.redirect(this.spotifyService.buildAuthUrl(state));
        });
    }

    async callback(req: Request, res: Response, next: NextFunction) {
        const error = req.query.error;
        const code = req.query.code;
        const receivedState = req.query.state;
        const storedState = req.session.spotifyAuthState;

        if (typeof error === "string") {
            this.logger.error(`Error received from Spotify authorization: ${error}`);
            res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=false&error=${encodeURIComponent(error)}`);
            return;
        }

        if (!receivedState || receivedState !== storedState) {
            this.logger.error("State mismatch or missing state from Spotify authorization.", {
                receivedState,
                storedState: storedState ?? "NOT_FOUND_IN_SESSION",
            });
            res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=false&error=state_mismatch`);
            return;
        }

        if (typeof code !== "string") {
            this.logger.error("Unexpected error: Missing code from Spotify authorization");
            res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=false&error=missing_code`);
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
        req.session.spotifyAuthState = undefined;
        req.session.save((err) => {
            if (err) {
                next(err);
            } else {
                res.redirect(`${this.appConfig.frontendBaseUrl}/login?success=true`);
            }
        });
    }
}
