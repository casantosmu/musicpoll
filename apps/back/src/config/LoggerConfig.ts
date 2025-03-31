import { envEnum } from "@/config/helpers.js";

export default class LoggerConfig {
    readonly level: string;

    constructor() {
        this.level = envEnum("LOG_LEVEL", ["debug", "info", "warn", "error"], "info");
    }
}
