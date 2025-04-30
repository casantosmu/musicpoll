import { ErrorResponse } from "@/api/common";

const AuthAPI = {
    async logout() {
        const response = await fetch("/api/v1/auth/logout", {
            method: "POST",
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            try {
                const json = JSON.parse(message) as ErrorResponse;
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

export default AuthAPI;
