import pg from "pg";
import { Redis } from "ioredis";
import LoggerConfig from "@/config/LoggerConfig.js";
import PostgresConfig from "@/config/PostgresConfig.js";
import RedisConfig from "@/config/RedisConfig.js";
import Logger from "@/Logger.js";
import Queues from "@/Queues.js";
import UpdatePlaylistWorker from "@/queues/UpdatePlaylistWorker.js";
import SpotifyService from "@/services/SpotifyService.js";
import Cache from "@/Cache.js";
import SpotifyConfig from "@/config/SpotifyConfig.js";
import LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";
import PollService from "@/services/PollService.js";
import PollRepository from "@/repositories/PollRepository.js";
import PollSongRepository from "@/repositories/PollSongRepository.js";
import SongVoteRepository from "@/repositories/SongVoteRepository.js";
import { UPDATE_PLAYLIST_NAME } from "@/queues/UpdatePlaylist.js";

const pool = new pg.Pool(new PostgresConfig());
const redis = new Redis(new RedisConfig());
const logger = new Logger(new LoggerConfig());
const queues = new Queues(logger, new RedisConfig());

const updatePlaylistWorker = new UpdatePlaylistWorker(
    logger,
    new RedisConfig(),
    new SpotifyService(
        logger,
        new Cache(logger, redis),
        new SpotifyConfig(),
        new LinkedAccountRepository(logger, pool),
    ),
    new PollService(
        logger,
        queues,
        new PollRepository(logger, pool),
        new PollSongRepository(logger, pool),
        new SongVoteRepository(logger, pool),
    ),
);

await pool.query("SELECT 1+1");
logger.info("Successfully connected to Postgres");

await redis.ping();
logger.info("Successfully connected to Redis");

logger.info(`Starting ${UPDATE_PLAYLIST_NAME} worker...`);
await updatePlaylistWorker.start();
