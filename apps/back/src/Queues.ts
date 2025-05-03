import type Logger from "@/Logger.js";
import type RedisConfig from "@/config/RedisConfig.js";
import UpdatePlaylistQueue from "@/queues/UpdatePlaylistQueue.js";

export default class Queues {
    private readonly queues: {
        updatePlaylist: UpdatePlaylistQueue;
    };

    constructor(logger: Logger, redisConfig: RedisConfig) {
        this.queues = {
            updatePlaylist: new UpdatePlaylistQueue(logger, redisConfig, "updatePlaylist"),
        };
    }

    get<K extends keyof typeof this.queues>(queue: K): (typeof this.queues)[K] {
        return this.queues[queue];
    }
}
