import pg from "pg";
import type Logger from "@/Logger.js";
import Repository from "@/repositories/Repository.js";

interface User {
    id: string;
    email: string;
}

export default class UserRepository extends Repository<User> {
    constructor(logger: Logger, pool: pg.Pool) {
        super("users", logger, pool);
    }
}
