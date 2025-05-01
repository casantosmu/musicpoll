import { ResponseError, ResponseList } from "@/api/common";

interface ImageObject {
    url: string;
    height: string;
    width: string;
}

export interface TrackObject {
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
    limit?: number;
    offset?: number;
}

const SearchAPI = {
    async searchSongs(params: SearchSongsParams) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set("q", params.q);
        if (params.limit !== undefined) {
            urlSearchParams.set("limit", `${params.limit}`);
        }
        if (params.offset !== undefined) {
            urlSearchParams.set("offset", `${params.offset}`);
        }

        const response = await fetch(`/api/v1/songs/search?${urlSearchParams}`, {
            method: "GET",
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            try {
                const json = JSON.parse(message) as ResponseError;
                message = json.message;
            } catch {
                /* empty */
            }

            return {
                success: false as const,
                error: { status, message },
            };
        }

        const result = (await response.json()) as ResponseList<TrackObject>;

        return {
            success: true as const,
            ...result,
        };
    },
};

export default SearchAPI;
