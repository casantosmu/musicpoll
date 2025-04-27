import type Logger from "@/Logger.js";
import type { User } from "@/services/UserService.ts";

declare global {
    namespace Express {
        interface Request {
            logger: Logger;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        user: User;
    }
}

export {};
