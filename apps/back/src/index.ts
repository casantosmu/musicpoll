import LoggerConfig from "@/config/LoggerConfig.js";
import Logger from "@/Logger.js";
import Server from "@/Server.js";
import app from "@/app.js";
import ServerConfig from "@/config/ServerConfig.js";

const { port } = new ServerConfig();

const logger = new Logger(new LoggerConfig());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = new Server(app({ logger }));

const address = await server.start(port);

logger.info(`Server started on port ${address.port}`);
