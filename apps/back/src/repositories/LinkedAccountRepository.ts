import pg from "pg";
import type Logger from "@/Logger.js";
import Repository from "@/repositories/Repository.js";

interface LinkedAccount {
    id: string;
    userId: string;
    provider: string;
    providerUserId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export default class LinkedAccountRepository extends Repository<LinkedAccount> {
    constructor(logger: Logger, pool: pg.Pool) {
        super("linked_accounts", logger, pool);
    }
}
