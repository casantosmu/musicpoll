import { ResponseError, Response } from "@/api/common";

interface CreatePoll {
    title: string;
    description: string | null;
    songs: {
        id: string;
        title: string;
        artist: string;
        album: string;
        albumImg: string;
    }[];
}

interface PollSong {
    id: string;
    songId: string;
    title: string;
    artist: string;
    album: string;
    albumImg: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Poll {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    songs: PollSong[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Vote {
    pollSongId: string;
    action: "add";
}

export interface PollResult {
    votes: {
        count: number;
        id: string;
        spotifySongId: string;
        title: string;
        artist: string;
        album: string;
        albumImg: string;
    }[];
    totalVotes: number;
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
}

const PollAPI = {
    async getById(id: string) {
        const response = await fetch(`/api/v1/polls/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            let code = "INTERNAL_SERVER_ERROR";
            try {
                const json = JSON.parse(message) as ResponseError;
                message = json.message;
                code = json.code;
            } catch {
                /* empty */
            }

            return {
                success: false as const,
                error: { status, message, code },
            };
        }

        const { data } = (await response.json()) as Response<Poll>;

        return {
            success: true as const,
            data,
        };
    },
    async create(poll: CreatePoll) {
        const response = await fetch("/api/v1/polls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(poll),
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            let code = "INTERNAL_SERVER_ERROR";
            try {
                const json = JSON.parse(message) as ResponseError;
                message = json.message;
                code = json.code;
            } catch {
                /* empty */
            }

            return {
                success: false as const,
                error: { status, message, code },
            };
        }

        const { data } = (await response.json()) as Response<Poll>;

        return {
            success: true as const,
            data,
        };
    },
    async vote(votes: Vote[]) {
        const response = await fetch("/api/v1/polls/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(votes),
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            let code = "INTERNAL_SERVER_ERROR";
            try {
                const json = JSON.parse(message) as ResponseError;
                message = json.message;
                code = json.code;
            } catch {
                /* empty */
            }

            return {
                success: false as const,
                error: { status, message, code },
            };
        }

        return {
            success: true as const,
            data: null,
        };
    },
    async getResultByPollId(id: string) {
        const response = await fetch(`/api/v1/polls/${id}/results`, {
            method: "GET",
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            let code = "INTERNAL_SERVER_ERROR";
            try {
                const json = JSON.parse(message) as ResponseError;
                message = json.message;
                code = json.code;
            } catch {
                /* empty */
            }

            return {
                success: false as const,
                error: { status, message, code },
            };
        }

        const { data } = (await response.json()) as Response<PollResult>;

        return {
            success: true as const,
            data,
        };
    },
};

export default PollAPI;
