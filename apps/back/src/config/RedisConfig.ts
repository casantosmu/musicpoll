import { envInt, envStr } from "@/config/helpers.js";

export default class RedisConfig {
    db: number;
    password: string;
    lazyConnect: boolean;

    constructor() {
        this.db = envInt("REDIS_DB");
        this.password = envStr("REDIS_PASSWORD");
        this.lazyConnect = true;
    }
}
