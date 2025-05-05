const fs = require("node:fs");
const path = require("node:path");

const secretsPath = path.resolve(__dirname, "secrets.json");
const secrets = JSON.parse(fs.readFileSync(secretsPath, "utf8"));

const env = {
    NODE_ENV: "production",
    FRONTEND_BASEURL: "https://musicpoll.net",
    PORT: 8080,
    COOKIE_MAX_AGE: 2592000000,
    COOKIE_SECURE: true,
    TRUST_PROXY: 2,
    LOG_LEVEL: "info",
    POSTGRES_DB: "musicpoll",
    POSTGRES_USER: "musicpoll",
    REDIS_DB: 0,
    SPOTIFY_CLIENT_ID: "148a0d56acf54f9eba831475b65c10bc",
    SPOTIFY_REDIRECT_URI: "https://musicpoll.net/api/v1/auth/spotify/callback",
    ...secrets,
};

module.exports = {
    apps: [
        {
            name: "musicpoll-back",
            script: "./dist/index.app.js",
            instances: "max",
            exec_mode: "cluster",
            env,
        },
        {
            name: "musicpoll-workers",
            script: "./dist/index.workers.js",
            instances: 1,
            exec_mode: "fork",
            env,
        },
    ],
};
