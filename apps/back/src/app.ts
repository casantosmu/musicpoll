import type { Redis } from "ioredis";
import pg from "pg";
import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import type Logger from "@/Logger.js";
import ServerConfig from "@/config/ServerConfig.js";
import SpotifyConfig from "@/config/SpotifyConfig.js";
import reqLog from "@/middlewares/reqLog.js";
import redirectToLocalhost from "@/middlewares/redirectToLocalhost.js";

import PollController from "@/controllers/PollController.js";
import PollService from "@/services/PollService.js";
import PollRepository from "@/repositories/PollRepository.js";
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
    redis: Redis;
}

export default function app({ logger, pool, redis }: Parameters) {
    const serverConfig = new ServerConfig();
    const spotifyConfig = new SpotifyConfig();

    const app = express();

    app.use(reqLog(logger));
    app.use(redirectToLocalhost());
    app.use(express.json());
    app.use(
        session({
            store: new RedisStore({
                client: redis,
                prefix: "musicpoll:session:",
            }),
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

    app.post("/v1/polls", async (req, res) => {
        await new PollController(new PollService(req.logger, new PollRepository(req.logger, pool))).create(req, res);
    });

    app.get("/v1/users/me", (req, res) => {
        new UserController().me(req, res);
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
