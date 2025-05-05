import type Logger from "@/Logger.js";
import type Cache from "@/Cache.js";
import type SpotifyConfig from "@/config/SpotifyConfig.js";
import type LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";
import type { ResultList } from "@/services/common.js";
import InternalServerError from "@/errors/InternalServerError.js";

interface Paginated<Item> {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: Item[];
}

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

interface PlaylistTrackObject {
    added_at: string;
    added_by: {
        id: string;
    };
    track: TrackObject;
}

interface SearchSongsParams {
    q: string;
    userId: string;
    limit?: number;
    offset?: number;
}

interface CreatePlaylistParams {
    userId: string;
    spotifyUserId: string;
    name: string;
    description?: string | null;
}

interface ReplacePlaylistItemsParams {
    userId: string;
    spotifyPlaylistId: string;
    trackIds: string[];
}

export default class SpotifyService {
    private readonly logger: Logger;
    private readonly cache: Cache;
    private readonly spotifyConfig: SpotifyConfig;
    private readonly linkedAccountRepository: LinkedAccountRepository;

    constructor(
        logger: Logger,
        cache: Cache,
        spotifyConfig: SpotifyConfig,
        linkedAccountRepository: LinkedAccountRepository,
    ) {
        this.logger = logger.child({ name: this.constructor.name });
        this.cache = cache;
        this.spotifyConfig = spotifyConfig;
        this.linkedAccountRepository = linkedAccountRepository;
    }

    async searchSongs({ userId, q, limit = 25, offset = 0 }: SearchSongsParams) {
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

        const accessToken = await this.accessToken(userId);
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
            tracks: Paginated<TrackObject>;
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

    async createPlaylist({ userId, spotifyUserId, name, description }: CreatePlaylistParams) {
        const accessToken = await this.accessToken(userId);
        const response = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description: description ?? "",
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            throw new InternalServerError(`${response.status} ${response.statusText} ${body}`);
        }

        const json = (await response.json()) as {
            id: string;
            name: string;
            description: string | null;
            tracks: Paginated<PlaylistTrackObject>;
            external_urls: {
                spotify: string;
            };
            images: ImageObject[];
        };

        return {
            id: json.id,
        };
    }

    async replacePlaylistItems({ userId, spotifyPlaylistId, trackIds }: ReplacePlaylistItemsParams) {
        const accessToken = await this.accessToken(userId);
        const response = await fetch(`https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uris: trackIds.map((id) => `spotify:track:${id}`),
            }),
        });

        if (!response.ok) {
            const body = await response.text();
            throw new InternalServerError(`${response.status} ${response.statusText} ${body}`);
        }
    }

    buildAuthUrl() {
        const url = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", this.spotifyConfig.clientId);
        url.searchParams.set("scope", "user-read-email playlist-modify-public playlist-modify-private");
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
            display_name: string /* it's documented as nullable */;
        };

        return {
            id: data.id,
            email: data.email,
            displayName: data.display_name,
        };
    }

    private async accessToken(userId: string) {
        const linkedAccount = await this.linkedAccountRepository.findSpotifyAccountByUserId(userId);
        if (!linkedAccount) {
            throw new InternalServerError(`No Spotify account linked for user ${userId}`);
        }

        const now = new Date();
        if (linkedAccount.expiresAt <= now) {
            this.logger.info(`Access token expired for ${userId}, refreshing`);

            const tokenResponse = await this.refreshAccessToken(linkedAccount.refreshToken);

            await this.linkedAccountRepository.update(linkedAccount.id, {
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken,
                expiresAt: tokenResponse.expiresAt,
            });

            return tokenResponse.accessToken;
        }

        return linkedAccount.accessToken;
    }

    private async refreshAccessToken(refreshToken: string) {
        const url = new URL("https://accounts.spotify.com/api/token");

        const body = new URLSearchParams();
        body.set("grant_type", "refresh_token");
        body.set("refresh_token", refreshToken);

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
            refresh_token?: string;
            expires_in: number;
        };

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token ?? refreshToken,
            expiresAt: new Date(Date.now() + (data.expires_in - 60) * 1000),
        };
    }
}
