import express from "express";
import type Logger from "@/Logger.js";
import SpotifyConfig from "@/config/SpotifyConfig.js";
import reqLog from "@/middlewares/reqLog.js";
import SpotifyAuthService from "@/services/SpotifyAuthService.js";
import SpotifyAuthController from "@/controllers/SpotifyAuthController.js";

interface Parameters {
    logger: Logger;
}

export default function app({ logger }: Parameters) {
    const spotifyConfig = new SpotifyConfig();
    const app = express();

    app.use(reqLog(logger));

    app.get("/v1/auth/spotify/login", (req, res) => {
        const spotifyService = new SpotifyAuthService(spotifyConfig);
        new SpotifyAuthController(req.logger, spotifyService).spotifyLogin(req, res);
    });

    app.get("/v1/auth/spotify/callback", async (req, res) => {
        const spotifyService = new SpotifyAuthService(spotifyConfig);
        await new SpotifyAuthController(req.logger, spotifyService).spotifyCallback(req, res);
    });

    return app;
}
