import pg from "pg";
import Repository from "@/repositories/Repository.js";
import type Logger from "@/Logger.js";

interface PollSong {
    id: string;
    songId: string;
    pollId: string;
    title: string;
    artist: string;
    album: string;
    albumImg: string;
    createdAt: Date;
    updatedAt: Date;
}

export default class PollSongRepository extends Repository<PollSong> {
    constructor(logger: Logger, pool: pg.Pool) {
        super("poll_songs", logger, pool);
    }
}
