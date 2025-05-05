import type Logger from "@/Logger.js";
import type RedisConfig from "@/config/RedisConfig.js";
import type PollService from "@/services/PollService.js";
import type SpotifyService from "@/services/SpotifyService.js";
import { Job, Worker } from "bullmq";
import { UPDATE_PLAYLIST_NAME, type UpdatePlaylistData } from "@/queues/UpdatePlaylist.js";

export default class UpdatePlaylistWorker {
    private readonly worker: Worker;
    private readonly logger: Logger;
    private readonly spotifyService: SpotifyService;
    private readonly pollService: PollService;

    constructor(logger: Logger, redisConfig: RedisConfig, spotifyService: SpotifyService, pollService: PollService) {
        this.logger = logger.child({ name: this.constructor.name });
        this.spotifyService = spotifyService;
        this.pollService = pollService;

        this.worker = new Worker(UPDATE_PLAYLIST_NAME, this.process.bind(this), {
            connection: redisConfig,
            autorun: false,
        });
    }

    async start() {
        await this.worker.run();
    }

    async stop() {
        await this.worker.close();
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private async process(job: Job<UpdatePlaylistData>) {
        this.logger.info(`Processing job for poll ID: ${job.data.pollId}`);
    }
}
