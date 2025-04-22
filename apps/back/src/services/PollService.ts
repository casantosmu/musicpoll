import { randomUUID } from "node:crypto";
import type Logger from "@/Logger.js";
import type PollRepository from "@/repositories/PollRepository.js";

interface PollBase {
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
}

interface Poll extends PollBase {
    id: string;
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

    async create(data: PollBase): Promise<Poll> {
        const poll = {
            id: randomUUID(),
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
