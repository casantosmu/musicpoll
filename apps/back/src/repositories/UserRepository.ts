import pg from "pg";
import type Logger from "@/Logger.js";
import type User from "@/models/User.js";
import Repository from "@/repositories/Repository.js";

export default class UserRepository extends Repository<User> {
    constructor(logger: Logger, pool: pg.Pool) {
        super("users", logger, pool);
    }
}
