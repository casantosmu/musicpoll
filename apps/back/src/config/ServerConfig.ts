export default class ServerConfig {
    readonly port: number;

    constructor() {
        this.port = parseInt(process.env.PORT ?? "3000", 10);
    }
}
