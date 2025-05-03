import { envStr } from "@/config/helpers.js";

export default class AppConfig {
    readonly frontendBaseUrl: string;

    constructor() {
        this.frontendBaseUrl = envStr("FRONTEND_BASEURL");
    }
}
