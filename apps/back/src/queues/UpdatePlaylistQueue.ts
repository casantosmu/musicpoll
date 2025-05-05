import type RedisConfig from "@/config/RedisConfig.js";
import { Queue } from "bullmq";
import { UPDATE_PLAYLIST_NAME, type UpdatePlaylistData } from "@/queues/UpdatePlaylist.js";

export default class UpdatePlaylistQueue {
    private readonly queue: Queue;

    constructor(redisConfig: RedisConfig) {
        this.queue = new Queue(UPDATE_PLAYLIST_NAME, {
            connection: redisConfig,
        });
    }

    async addJob(data: UpdatePlaylistData) {
        await this.queue.add(`update_playlist_from_poll_${data.pollId}`, data, {
            removeOnComplete: 1000,
            removeOnFail: 5000,
            deduplication: { id: data.pollId /** ttl: 60 * 1000 */ },
            delay: 60 * 1000,
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        });
    }
}
