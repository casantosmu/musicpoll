import type { Redis } from "ioredis";
import pg from "pg";
import express from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import AppConfig from "@/config/AppConfig.js";
import ServerConfig from "@/config/ServerConfig.js";
import SpotifyConfig from "@/config/SpotifyConfig.js";
import reqLog from "@/middlewares/reqLog.js";
import redirectToLocalhost from "@/middlewares/redirectToLocalhost.js";
import errorHandler from "@/errors/errorHandler.js";

import Cache from "@/Cache.js";
import Validator from "@/Validator.js";
import type Logger from "@/Logger.js";
import type Queues from "@/Queues.js";

import PollController from "@/controllers/PollController.js";
import PollService from "@/services/PollService.js";
import PollRepository from "@/repositories/PollRepository.js";
import SearchController from "@/controllers/SearchController.js";
import UserController from "@/controllers/UserController.js";
import AuthController from "@/controllers/AuthController.js";
import LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";
import UserRepository from "@/repositories/UserRepository.js";
import UserService from "@/services/UserService.js";
import SpotifyService from "@/services/SpotifyService.js";
import SpotifyAuthController from "@/controllers/SpotifyAuthController.js";
import PollSongRepository from "@/repositories/PollSongRepository.js";
import SongVoteRepository from "@/repositories/SongVoteRepository.js";

interface Parameters {
    logger: Logger;
    pool: pg.Pool;
    redis: Redis;
    queues: Queues;
}

export default function app({ logger, pool, redis, queues }: Parameters) {
    const validator = new Validator();

    const appConfig = new AppConfig();
    const serverConfig = new ServerConfig();
    const spotifyConfig = new SpotifyConfig();

    const app = express();
    app.set("trust proxy", serverConfig.trustProxy);

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

    app.get("/api/v1/polls/:id", async (req, res) => {
        await new PollController(
            validator,
            new PollService(
                req.logger,
                queues,
                new PollRepository(req.logger, pool),
                new PollSongRepository(req.logger, pool),
                new SongVoteRepository(req.logger, pool),
            ),
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).get(req, res);
    });

    app.post("/api/v1/polls", async (req, res) => {
        await new PollController(
            validator,
            new PollService(
                req.logger,
                queues,
                new PollRepository(req.logger, pool),
                new PollSongRepository(req.logger, pool),
                new SongVoteRepository(req.logger, pool),
            ),
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).create(req, res);
    });

    app.post("/api/v1/polls/vote", async (req, res) => {
        await new PollController(
            validator,
            new PollService(
                req.logger,
                queues,
                new PollRepository(req.logger, pool),
                new PollSongRepository(req.logger, pool),
                new SongVoteRepository(req.logger, pool),
            ),
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).vote(req, res);
    });

    app.get("/api/v1/polls/:id/results", async (req, res) => {
        await new PollController(
            validator,
            new PollService(
                req.logger,
                queues,
                new PollRepository(req.logger, pool),
                new PollSongRepository(req.logger, pool),
                new SongVoteRepository(req.logger, pool),
            ),
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).result(req, res);
    });

    app.get("/api/v1/songs/search", async (req, res) => {
        await new SearchController(
            validator,
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).searchSongs(req, res);
    });

    app.get("/api/v1/users/me", (req, res) => {
        new UserController(
            validator,
            new UserService(
                req.logger,
                new UserRepository(req.logger, pool),
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).me(req, res);
    });

    app.get("/api/v1/users/:id", async (req, res) => {
        await new UserController(
            validator,
            new UserService(
                req.logger,
                new UserRepository(req.logger, pool),
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).getById(req, res);
    });

    app.post("/api/v1/auth/logout", (req, res, next) => {
        new AuthController().logout(req, res, next);
    });

    app.get("/api/v1/auth/spotify/login", (req, res) => {
        new SpotifyAuthController(
            req.logger,
            appConfig,
            new UserService(
                req.logger,
                new UserRepository(req.logger, pool),
                new LinkedAccountRepository(req.logger, pool),
            ),
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).login(req, res);
    });

    app.get("/api/v1/auth/spotify/callback", async (req, res, next) => {
        await new SpotifyAuthController(
            req.logger,
            appConfig,
            new UserService(
                req.logger,
                new UserRepository(req.logger, pool),
                new LinkedAccountRepository(req.logger, pool),
            ),
            new SpotifyService(
                req.logger,
                new Cache(req.logger, redis),
                spotifyConfig,
                new LinkedAccountRepository(req.logger, pool),
            ),
        ).callback(req, res, next);
    });

    errorHandler(app);

    return app;
}
