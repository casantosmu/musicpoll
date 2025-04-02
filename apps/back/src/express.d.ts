import type Logger from "@/Logger.js";
import type User from "@/models/user/User.js";

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
