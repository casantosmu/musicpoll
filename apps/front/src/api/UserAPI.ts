import { ResponseError, Response } from "@/api/common";

interface SpotifyAccount {
    id: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface User {
    id: string;
    email: string;
    spotifyAccount: SpotifyAccount;
    createdAt: Date;
    updatedAt: Date;
}

const UserAPI = {
    async me() {
        const response = await fetch("/api/v1/users/me", {
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

        const { data } = (await response.json()) as Response<User>;

        return {
            success: true as const,
            data,
        };
    },
};

export default UserAPI;
