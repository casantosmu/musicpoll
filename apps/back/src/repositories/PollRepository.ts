import pg from "pg";
import Repository from "@/repositories/Repository.js";
import type Logger from "@/Logger.js";

interface Poll {
    id: string;
    userId: string;
    spotifyPlaylistId: string;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default class PollRepository extends Repository<Poll> {
    constructor(logger: Logger, pool: pg.Pool) {
        super("polls", logger, pool);
    }
}
