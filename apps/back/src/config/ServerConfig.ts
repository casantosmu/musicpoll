import { envNum } from "@/config/helpers.js";

export default class ServerConfig {
    readonly port: number;

    constructor() {
        this.port = envNum("PORT");
    }
}
