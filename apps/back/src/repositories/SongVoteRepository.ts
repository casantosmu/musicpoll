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

    async hasUserVoted(userId: string, pollId: string) {
        const sql = `
            SELECT EXISTS (
                SELECT 1
                FROM song_votes sv
                JOIN poll_songs ps ON sv.poll_song_id = ps.id
                WHERE sv.user_id = $1
                  AND ps.poll_id = $2
            );`;

        const result = await this.query(sql, [userId, pollId]);
        return (result.rows[0] as { exists: boolean }).exists;
    }
}
