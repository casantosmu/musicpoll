import type { Job } from "bullmq";
import Queue from "@/queues/Queue.js";

interface JobData {
    pollId: string;
}

export default class UpdatePlaylistQueue extends Queue<JobData> {
    async addJob(data: JobData) {
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

    // eslint-disable-next-line @typescript-eslint/require-await
    protected async process(job: Job<JobData>) {
        console.log("processing", job.data.pollId);
    }
}
