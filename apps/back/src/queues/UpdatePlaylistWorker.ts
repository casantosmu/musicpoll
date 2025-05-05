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

    private async process(job: Job<UpdatePlaylistData>) {
        this.logger.info(`Processing job for poll ID: ${job.data.pollId}`);

        const poll = await this.pollService.getById(job.data.pollId);
        this.logger.debug(`Retrieved poll: ${poll.id}, playlist: ${poll.spotifyPlaylistId}`);

        const votesResult = await this.pollService.getResultByPollId(poll.id, {
            limit: 100,
        });
        this.logger.debug(`Retrieved ${votesResult.votes.length} songs with votes for poll: ${poll.id}`);

        await this.spotifyService.replacePlaylistItems({
            userId: poll.userId,
            spotifyPlaylistId: poll.spotifyPlaylistId,
            trackIds: votesResult.votes.map((vote) => vote.spotifySongId),
        });
        this.logger.info(`Successfully updated playlist ${poll.spotifyPlaylistId} for poll: ${poll.id}`);
    }
}
