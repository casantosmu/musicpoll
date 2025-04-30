import type { Redis } from "ioredis";
import type Logger from "@/Logger.js";

const PREFIX = "musicpoll:cache:";
const DEFAULT_TTL_SECONDS = 3600;

export default class Cache {
    private readonly logger: Logger;
    private readonly redis: Redis;

    constructor(logger: Logger, redis: Redis) {
        this.logger = logger.child({ name: this.constructor.name });
        this.redis = redis;
    }

    async get<T>(key: string) {
        const prefixedKey = PREFIX + key;

        const data = await this.redis.get(prefixedKey);
        if (data === null) {
            this.logger.debug(`Cache miss for key: ${prefixedKey}`);
            return null;
        }

        this.logger.debug(`Cache hit for key: ${prefixedKey}`);
        return JSON.parse(data) as T;
    }

    async set(key: string, value: unknown, ttlSeconds?: number) {
        const prefixedKey = PREFIX + key;
        const ttl = ttlSeconds ?? DEFAULT_TTL_SECONDS;
        const serializedValue = JSON.stringify(value);

        await this.redis.set(prefixedKey, serializedValue, "EX", ttl);
        this.logger.debug(`Set cache key: ${prefixedKey} complete with TTL: ${ttl}`);
    }

    async delete(key: string) {
        const prefixedKey = PREFIX + key;

        const result = await this.redis.del(prefixedKey);
        this.logger.debug(`Delete cache key: ${prefixedKey} complete, removed: ${result} keys`);
    }
}
