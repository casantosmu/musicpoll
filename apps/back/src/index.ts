import pg from "pg";
import LoggerConfig from "@/config/LoggerConfig.js";
import PostgresConfig from "@/config/PostgresConfig.js";
import ServerConfig from "@/config/ServerConfig.js";
import Logger from "@/Logger.js";
import Server from "@/Server.js";
import app from "@/app.js";

const { port } = new ServerConfig();

const pool = new pg.Pool(new PostgresConfig());
const logger = new Logger(new LoggerConfig());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = new Server(app({ logger }));

await pool.query("SELECT 1+1");
logger.info("Successfully connected to Postgres");

const address = await server.start(port);
logger.info(`Server started on port ${address.port}`);
