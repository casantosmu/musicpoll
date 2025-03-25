import { pino } from "pino";
import LoggerConfig from "@/config/LoggerConfig.js";

export default class Logger {
    private readonly logger: pino.Logger;

    constructor(arg: pino.Logger | LoggerConfig) {
        if (arg instanceof LoggerConfig) {
            this.logger = pino({
                level: arg.level,
                errorKey: "error",
                messageKey: "message",
            });
        } else {
            this.logger = arg;
        }
    }

    child(bindings: Record<string, unknown>) {
        return new Logger(this.logger.child(bindings));
    }

    info(message: string, payload?: unknown) {
        this.#log("info", message, payload);
    }

    debug(message: string, payload?: unknown) {
        this.#log("debug", message, payload);
    }

    warn(message: string, payload?: unknown) {
        this.#log("warn", message, payload);
    }

    error(message: string, payload?: unknown) {
        this.#log("error", message, payload);
    }

    #log(level: "debug" | "info" | "warn" | "error", message: string, payload?: unknown) {
        if (payload instanceof Error) {
            this.logger[level]({ error: payload }, message);
        } else if (payload) {
            this.logger[level]({ payload }, message);
        } else {
            this.logger[level](message);
        }
    }
}
