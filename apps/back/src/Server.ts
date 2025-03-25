import type { AddressInfo } from "node:net";
import http from "node:http";
import { once } from "node:events";

export default class Server {
    private readonly server: http.Server;

    constructor(app: http.RequestListener) {
        this.server = http.createServer(app);
    }

    async start(port: number) {
        this.server.listen(port);
        await once(this.server, "listening");
        return this.server.address() as AddressInfo;
    }

    async stop() {
        await new Promise<void>((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
}
