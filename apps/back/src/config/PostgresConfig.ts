export default class PostgresConfig {
    readonly database: string;
    readonly user: string;
    readonly password: string;

    constructor() {
        const database = process.env.POSTGRES_DB;
        if (!database) {
            throw new Error("POSTGRES_DB env not found");
        }
        this.database = database;

        const user = process.env.POSTGRES_USER;
        if (!user) {
            throw new Error("POSTGRES_USER env not found");
        }
        this.user = user;

        const password = process.env.POSTGRES_PASSWORD;
        if (!password) {
            throw new Error("POSTGRES_PASSWORD env not found");
        }
        this.password = password;
    }
}
