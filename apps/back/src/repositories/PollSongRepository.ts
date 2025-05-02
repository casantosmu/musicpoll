import pg from "pg";
import camelcaseKeys from "camelcase-keys";
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

    async findByPollId(pollId: string) {
        const result = await this.query(`SELECT * FROM ${this.tableName} WHERE poll_id = $1;`, [pollId]);
        return camelcaseKeys(result.rows) as PollSong[];
    }
}
