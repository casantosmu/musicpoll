import pg from "pg";
import { Redis } from "ioredis";
import LoggerConfig from "@/config/LoggerConfig.js";
import PostgresConfig from "@/config/PostgresConfig.js";
import RedisConfig from "@/config/RedisConfig.js";
import ServerConfig from "@/config/ServerConfig.js";
import Logger from "@/Logger.js";
import Server from "@/Server.js";
import app from "@/app.js";

const { port } = new ServerConfig();

const pool = new pg.Pool(new PostgresConfig());
const redis = new Redis(new RedisConfig());
const logger = new Logger(new LoggerConfig());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = new Server(app({ logger, pool, redis }));

await pool.query("SELECT 1+1");
logger.info("Successfully connected to Postgres");

await redis.ping();
logger.info("Successfully connected to Redis");

const address = await server.start(port);
logger.info(`Server started on port ${address.port}`);
