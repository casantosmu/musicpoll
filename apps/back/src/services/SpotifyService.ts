import type Cache from "@/Cache.js";
import type SpotifyConfig from "@/config/SpotifyConfig.js";
import InternalServerError from "@/errors/InternalServerError.js";
import type { ResultList } from "@/services/common.js";

interface ImageObject {
    url: string;
    height: string;
    width: string;
}

interface TrackObject {
    id: string;
    name: string;
    album: {
        id: string;
        name: string;
        images: ImageObject[];
    };
    artists: {
        id: string;
        name: string;
    }[];
}

interface SearchSongsParams {
    q: string;
    accessToken: string;
    limit?: number;
    offset?: number;
}

export default class SpotifyService {
    private readonly spotifyConfig: SpotifyConfig;
    private readonly cache: Cache;

    constructor(spotifyConfig: SpotifyConfig, cache: Cache) {
        this.spotifyConfig = spotifyConfig;
        this.cache = cache;
    }

    async searchSongs({ accessToken, q, limit = 25, offset = 0 }: SearchSongsParams) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set("q", q);
        urlSearchParams.set("type", "track");
        urlSearchParams.set("limit", `${limit}`);
        urlSearchParams.set("offset", `${offset}`);

        const cacheKey = `spotify:search:${urlSearchParams}`;

        const cached = await this.cache.get<ResultList<TrackObject>>(cacheKey);
        if (cached) {
            return cached;
        }

        const response = await fetch(`https://api.spotify.com/v1/search?${urlSearchParams}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const body = await response.text();
            throw new InternalServerError(`${response.status} ${response.statusText} ${body}`);
        }

        const json = (await response.json()) as {
            tracks: {
                limit: number;
                offset: number;
                total: number;
                items: TrackObject[];
            };
        };

        const result: ResultList<TrackObject> = {
            pagination: {
                limit: json.tracks.limit,
                offset: json.tracks.offset,
                total: json.tracks.total,
            },
            data: json.tracks.items.map((item) => ({
                id: item.id,
                name: item.name,
                album: {
                    id: item.album.id,
                    name: item.album.name,
                    images: item.album.images.map((image) => ({
                        url: image.url,
                        height: image.height,
                        width: image.width,
                    })),
                },
                artists: item.artists.map((artist) => ({
                    id: artist.id,
                    name: artist.name,
                })),
            })),
        };

        await this.cache.set(cacheKey, result);
        return result;
    }

    buildAuthUrl() {
        const url = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.spotifyConfig.clientId);
        url.searchParams.set("scope", "user-read-email playlist-modify-public");
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
            const body = await response.text();
            throw new InternalServerError(`${response.status} ${response.statusText} ${body}`);
        }

        const data = (await response.json()) as {
            access_token: string;
            refresh_token: string;
            expires_in: number;
        };

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: new Date(Date.now() + (data.expires_in - 60) * 1000),
        };
    }

    async getMe(accessToken: string) {
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const body = await response.text();
            throw new InternalServerError(`${response.status} ${response.statusText} ${body}`);
        }

        const data = (await response.json()) as {
            id: string;
            email: string;
        };

        return {
            id: data.id,
            email: data.email,
        };
    }
}
