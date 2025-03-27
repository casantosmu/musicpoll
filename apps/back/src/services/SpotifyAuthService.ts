import camelcaseKeys from "camelcase-keys";
import type SpotifyConfig from "@/config/SpotifyConfig.js";
import InternalServerError from "@/errors/InternalServerError.js";

export default class SpotifyAuthService {
    private readonly spotifyConfig: SpotifyConfig;

    constructor(spotifyConfig: SpotifyConfig) {
        this.spotifyConfig = spotifyConfig;
    }

    buildAuthUrl() {
        const url = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.spotifyConfig.clientId);
        url.searchParams.set("scope", "playlist-modify-public");
        url.searchParams.set("redirect_uri", this.spotifyConfig.redirectUri);
        return url.toString();
    }

    async getAccessToken(code: string) {
        const url = new URL("https://accounts.spotify.com/api/token");

        const body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", code);
        body.set("redirect_uri", this.spotifyConfig.redirectUri);

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(this.spotifyConfig.clientId + ":" + this.spotifyConfig.clientSecret).toString("base64")}`,
            },
        });

        if (!response.ok) {
            throw new InternalServerError(`${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as {
            access_token: string;
            token_type: string;
            scope: string;
            expires_in: number;
            refresh_token: string;
        };

        return camelcaseKeys(data);
    }
}
