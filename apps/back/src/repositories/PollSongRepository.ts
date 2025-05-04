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

    async countVotesByPollId(pollId: string) {
        const votesSql = `
            SELECT count(sv.poll_song_id)::int as count, ps.id, ps.song_id, ps.title, ps.artist, ps.album, ps.album_img
            FROM ${this.tableName} ps
            LEFT JOIN song_votes sv ON ps.id = sv.poll_song_id
            WHERE ps.poll_id = $1
            GROUP BY ps.id, ps.song_id, ps.title, ps.artist, ps.album, ps.album_img
            ORDER BY count DESC;
        `;
        const totalVotesSql = `
            SELECT count(*)::int as count
            FROM ${this.tableName} ps
            JOIN song_votes sv ON ps.id = sv.poll_song_id
            WHERE ps.poll_id = $1;
        `;

        const [votes, totalVotes] = await Promise.all([
            this.query(votesSql, [pollId]),
            this.query(totalVotesSql, [pollId]),
        ]);

        return {
            votes: camelcaseKeys(votes.rows) as {
                count: number;
                id: string;
                songId: string;
                title: string;
                artist: string;
                album: string;
                albumImg: string;
            }[],
            totalVotes: (totalVotes.rows[0] as { count: number }).count,
        };
    }
}
