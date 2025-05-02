import { ResponseError, Response } from "@/api/common";

interface CreatePoll {
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
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
    allowMultipleOptions: boolean;
    songs: PollSong[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Vote {
    pollSongId: string;
    action: "add";
}

const PollAPI = {
    async getById(id: string) {
        const response = await fetch(`/api/v1/polls/${id}`, {
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

        return {
            success: true as const,
            data: null,
        };
    },
};

export default PollAPI;
