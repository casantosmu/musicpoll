interface CreatePoll {
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
}

const API = {
    async createPoll(poll: CreatePoll) {
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
                const json = JSON.parse(message) as { message: string };
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
    async logout() {
        const response = await fetch("/api/v1/auth/logout", {
            method: "POST",
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            try {
                const json = JSON.parse(message) as { message: string };
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
    async me() {
        const response = await fetch("/api/v1/users/me", {
            method: "GET",
        });

        if (!response.ok) {
            const status = response.status;

            let message = await response.text();
            try {
                const json = JSON.parse(message) as { message: string };
                message = json.message;
            } catch {
                /* empty */
            }

            return {
                success: false as const,
                error: { status, message },
            };
        }

        const { data } = (await response.json()) as {
            data: { id: string; email: string };
        };

        return {
            success: true as const,
            data,
        };
    },
};

export default API;
