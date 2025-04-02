import { envBool, envNum, envStr } from "@/config/helpers.js";

export default class ServerConfig {
    readonly port: number;
    readonly cookieSecret: string;
    readonly cookieMaxAge: number;
    readonly cookieSecure: boolean;

    constructor() {
        this.port = envNum("PORT");
        this.cookieSecret = envStr("COOKIE_SECRET");
        this.cookieMaxAge = envNum("COOKIE_MAX_AGE", 30 * 24 * 60 * 60 * 1000);
        this.cookieSecure = envBool("COOKIE_SECURE", true);
    }
}
