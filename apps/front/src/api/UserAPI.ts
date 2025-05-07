import { ResponseError, Response } from "@/api/common";

export interface User {
    id: string;
    displayName: string;
}

const UserAPI = {
    async getByID(id: string) {
        const response = await fetch(`/api/v1/users/${id}`, {
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

        const { data } = (await response.json()) as Response<User>;

        return {
            success: true as const,
            data,
        };
    },

    async me() {
        const response = await fetch("/api/v1/users/me", {
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

        const { data } = (await response.json()) as Response<User>;

        return {
            success: true as const,
            data,
        };
    },
};

export default UserAPI;
