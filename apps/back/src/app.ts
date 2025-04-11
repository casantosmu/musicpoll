import pg from "pg";
import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import type Logger from "@/Logger.js";
import ServerConfig from "@/config/ServerConfig.js";
import SpotifyConfig from "@/config/SpotifyConfig.js";
import reqLog from "@/middlewares/reqLog.js";
import redirectToLocalhost from "@/middlewares/redirectToLocalhost.js";

import UserController from "@/controllers/UserController.js";
import AuthController from "@/controllers/AuthController.js";
import LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";
import UserRepository from "@/repositories/UserRepository.js";
import UserService from "@/services/UserService.js";
import SpotifyService from "@/services/SpotifyService.js";
import SpotifyAuthController from "@/controllers/SpotifyAuthController.js";

interface Parameters {
    logger: Logger;
    pool: pg.Pool;
}

export default function app({ logger, pool }: Parameters) {
    const serverConfig = new ServerConfig();
    const spotifyConfig = new SpotifyConfig();

    const app = express();

    app.use(reqLog(logger));
    app.use(redirectToLocalhost());
    app.use(
        session({
            store: new (pgSession(session))({ pool }),
            secret: serverConfig.cookieSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: serverConfig.cookieMaxAge,
                secure: serverConfig.cookieSecure,
                httpOnly: true,
                sameSite: "strict",
            },
        }),
    );

    app.get("/v1/users/me", (req, res, next) => {
        new UserController().me(req, res, next);
    });

    app.post("/v1/auth/logout", (req, res, next) => {
        new AuthController().logout(req, res, next);
    });

    app.get("/v1/auth/spotify/login", (req, res) => {
        new SpotifyAuthController(
            req.logger,
            new UserService(
                req.logger,
                new UserRepository(req.logger, pool),
                new LinkedAccountRepository(req.logger, pool),
            ),
            new SpotifyService(spotifyConfig),
        ).login(req, res);
    });

    app.get("/v1/auth/spotify/callback", async (req, res, next) => {
        await new SpotifyAuthController(
            req.logger,
            new UserService(
                req.logger,
                new UserRepository(req.logger, pool),
                new LinkedAccountRepository(req.logger, pool),
            ),
            new SpotifyService(spotifyConfig),
        ).callback(req, res, next);
    });

    return app;
}
