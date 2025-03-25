export default class LoggerConfig {
    readonly level: string;

    constructor() {
        this.level = process.env.LOG_LEVEL ?? "info";
    }
}
