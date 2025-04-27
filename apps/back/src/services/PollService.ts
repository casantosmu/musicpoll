import { randomUUID } from "node:crypto";
import type Logger from "@/Logger.js";
import type PollRepository from "@/repositories/PollRepository.js";

interface Poll {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default class PollService {
    private readonly logger: Logger;
    private readonly pollRepository: PollRepository;

    constructor(logger: Logger, pollRepository: PollRepository) {
        this.logger = logger.child({ name: this.constructor.name });
        this.pollRepository = pollRepository;
    }

    async create(data: Omit<Poll, "id" | "createdAt" | "updatedAt">): Promise<Poll> {
        const poll = {
            id: randomUUID(),
            userId: data.userId,
            title: data.title,
            description: data.description,
            allowMultipleOptions: data.allowMultipleOptions,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.pollRepository.save(poll);

        this.logger.info(`Poll ${poll.id} created`);
        return poll;
    }
}
