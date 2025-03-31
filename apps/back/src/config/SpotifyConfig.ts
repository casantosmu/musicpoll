import { envStr } from "@/config/helpers.js";

export default class SpotifyConfig {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly redirectUri: string;

    constructor() {
        this.clientId = envStr("SPOTIFY_CLIENT_ID");
        this.clientSecret = envStr("SPOTIFY_CLIENT_SECRET");
        this.redirectUri = envStr("SPOTIFY_REDIRECT_URI");
    }
}
