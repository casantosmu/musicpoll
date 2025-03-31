import { envStr } from "@/config/helpers.js";

export default class PostgresConfig {
    readonly database: string;
    readonly user: string;
    readonly password: string;

    constructor() {
        this.database = envStr("POSTGRES_DB");
        this.user = envStr("POSTGRES_USER");
        this.password = envStr("POSTGRES_PASSWORD");
    }
}
