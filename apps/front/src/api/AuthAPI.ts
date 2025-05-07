import { ResponseError } from "@/api/common";

const AuthAPI = {
    async logout() {
        const response = await fetch("/api/v1/auth/logout", {
            method: "POST",
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
};

export default AuthAPI;
