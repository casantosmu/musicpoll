export default class SpotifyConfig {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly redirectUri: string;

    constructor() {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        if (!clientId) {
            throw new Error("SPOTIFY_CLIENT_ID env not found");
        }
        this.clientId = clientId;

        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        if (!clientSecret) {
            throw new Error("SPOTIFY_CLIENT_SECRET env not found");
        }
        this.clientSecret = clientSecret;

        const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
        if (!redirectUri) {
            throw new Error("SPOTIFY_REDIRECT_URI env not found");
        }
        this.redirectUri = redirectUri;
    }
}
