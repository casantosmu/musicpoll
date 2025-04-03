import pg from "pg";
import camelcaseKeys from "camelcase-keys";
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

    async findByEmail(email: string) {
        const result = await this.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return null;
        }

        return camelcaseKeys(result.rows[0]) as User;
    }
}
