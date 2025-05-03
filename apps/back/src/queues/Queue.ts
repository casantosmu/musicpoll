import type Logger from "@/Logger.js";
import type RedisConfig from "@/config/RedisConfig.js";
import { Job, Queue as BullQueue, Worker as BullWorker } from "bullmq";

export default abstract class Queue<JobData> {
    protected readonly logger: Logger;
    protected readonly queue: BullQueue;
    protected readonly worker: BullWorker;

    constructor(logger: Logger, redisConfig: RedisConfig, name: string) {
        this.logger = logger.child({ name: this.constructor.name });

        this.queue = new BullQueue(name, {
            connection: redisConfig,
        });
        this.queue.on("waiting", () => {
            this.logger.debug("Job is waiting to be processed");
        });

        this.worker = new BullWorker(name, this.process.bind(this), {
            connection: redisConfig,
            // autorun: false,
        });
        this.worker.on("drained", () => {
            this.logger.debug("Queue is drained, no more jobs left");
        });
        this.worker.on("completed", () => {
            this.logger.debug("Job has completed");
        });
        this.worker.on("failed", () => {
            this.logger.debug("Job failed");
        });
    }

    // async start() {
    //     await this.worker.run();
    // }

    // async stop() {
    //     await this.worker.close();
    // }

    protected abstract process(job: Job<JobData>): Promise<void>;
}
