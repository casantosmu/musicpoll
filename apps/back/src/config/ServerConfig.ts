import { envBool, envInt, envStr } from "@/config/helpers.js";

export default class ServerConfig {
    readonly port: number;
    readonly cookieSecret: string;
    readonly cookieMaxAge: number;
    readonly cookieSecure: boolean;
    readonly trustProxy: number;

    constructor() {
        this.port = envInt("PORT");
        this.cookieSecret = envStr("COOKIE_SECRET");
        this.cookieMaxAge = envInt("COOKIE_MAX_AGE", 30 * 24 * 60 * 60 * 1000);
        this.cookieSecure = envBool("COOKIE_SECURE", true);
        this.trustProxy = envInt("TRUST_PROXY", 0);
    }
}
