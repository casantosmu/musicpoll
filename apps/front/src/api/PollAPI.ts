import { ErrorResponse, Response } from "@/api/common";

interface CreatePoll {
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
}

interface Poll {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PollAPI = {
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

        const { data } = (await response.json()) as Response<Poll>;

        return {
            success: true as const,
            data,
        };
    },
};

export default PollAPI;
