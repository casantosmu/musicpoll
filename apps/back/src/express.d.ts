import type Logger from "@/Logger.js";

declare global {
    namespace Express {
        interface Request {
            logger: Logger;
        }
    }
}

export {};
