import { randomUUID } from "node:crypto";
import type Logger from "@/Logger.js";
import type PollRepository from "@/repositories/PollRepository.js";
import type PollSongRepository from "@/repositories/PollSongRepository.js";
import NotFoundError from "@/errors/NotFoundError.js";

interface PollSong {
    id: string;
    songId: string;
    title: string;
    artist: string;
    album: string;
    albumImg: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Poll {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    allowMultipleOptions: boolean;
    songs: PollSong[];
    createdAt: Date;
    updatedAt: Date;
}

export default class PollService {
    private readonly logger: Logger;
    private readonly pollRepository: PollRepository;
    private readonly pollSongRepository: PollSongRepository;

    constructor(logger: Logger, pollRepository: PollRepository, pollSongRepository: PollSongRepository) {
        this.logger = logger.child({ name: this.constructor.name });
        this.pollRepository = pollRepository;
        this.pollSongRepository = pollSongRepository;
    }

    async getById(id: string): Promise<Poll> {
        const poll = await this.pollRepository.findById(id);

        if (!poll) {
            throw new NotFoundError();
        }

        const pollSongs = await this.pollSongRepository.findByPollId(id);

        return {
            id: poll.id,
            userId: poll.userId,
            title: poll.title,
            description: poll.description,
            allowMultipleOptions: poll.allowMultipleOptions,
            songs: pollSongs.map((song) => ({
                id: song.id,
                songId: song.songId,
                title: song.title,
                artist: song.artist,
                album: song.album,
                albumImg: song.albumImg,
                createdAt: song.createdAt,
                updatedAt: song.updatedAt,
            })),
            createdAt: poll.createdAt,
            updatedAt: poll.updatedAt,
        };
    }

    async create(
        data: Omit<Poll, "id" | "songs" | "createdAt" | "updatedAt"> & {
            songs: Omit<PollSong, "id" | "createdAt" | "updatedAt">[];
        },
    ): Promise<Poll> {
        const poll = {
            id: randomUUID(),
            userId: data.userId,
            title: data.title,
            description: data.description,
            allowMultipleOptions: data.allowMultipleOptions,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await this.pollRepository.save(poll);

        const songs = data.songs.map((song) => ({
            id: randomUUID(),
            songId: song.songId,
            pollId: poll.id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            albumImg: song.albumImg,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));
        await this.pollSongRepository.bulkSave(songs);

        this.logger.info(`Poll ${poll.id} created`);
        return { ...poll, songs };
    }
}
