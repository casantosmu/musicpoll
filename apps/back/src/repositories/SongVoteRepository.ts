import pg from "pg";
import Repository from "@/repositories/Repository.js";
import type Logger from "@/Logger.js";

interface SongVote {
    id: string;
    pollSongId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export default class SongVoteRepository extends Repository<SongVote> {
    constructor(logger: Logger, pool: pg.Pool) {
        super("song_votes", logger, pool);
    }
}
