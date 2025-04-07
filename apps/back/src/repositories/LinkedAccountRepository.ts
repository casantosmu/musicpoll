import pg from "pg";
import camelcaseKeys from "camelcase-keys";
import Repository from "@/repositories/Repository.js";
import type Logger from "@/Logger.js";

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

    async findByProviderAndProviderUserId(provider: string, providerUserId: string) {
        const result = await this.query(
            "SELECT * FROM linked_accounts WHERE provider = $1 AND provider_user_id = $2 LIMIT 1;",
            [provider, providerUserId],
        );

        if (result.rows.length === 0) {
            return null;
        }

        return camelcaseKeys(result.rows[0]) as LinkedAccount;
    }
}
