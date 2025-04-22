import { randomUUID } from "node:crypto";
import type Logger from "@/Logger.js";
import type UserRepository from "@/repositories/UserRepository.js";
import type LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";
import InternalServerError from "@/errors/InternalServerError.js";

interface SpotifyAccountBase {
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

interface UserBase {
    email: string;
    spotifyAccount: SpotifyAccountBase;
}

interface SpotifyAccount extends SpotifyAccountBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

interface User extends UserBase {
    id: string;
    spotifyAccount: SpotifyAccount;
    createdAt: Date;
    updatedAt: Date;
}

export default class UserService {
    private readonly logger: Logger;
    private readonly userRepository: UserRepository;
    private readonly linkedAccountRepository: LinkedAccountRepository;

    constructor(logger: Logger, userRepository: UserRepository, linkedAccountRepository: LinkedAccountRepository) {
        this.logger = logger.child({ name: this.constructor.name });
        this.userRepository = userRepository;
        this.linkedAccountRepository = linkedAccountRepository;
    }

    async upsert(data: UserBase): Promise<User> {
        const foundSpotifyAccount = await this.linkedAccountRepository.findByProviderAndProviderUserId(
            "spotify",
            data.spotifyAccount.userId,
        );

        if (foundSpotifyAccount) {
            const user = await this.userRepository.findById(foundSpotifyAccount.userId);
            if (!user) {
                throw new InternalServerError(
                    `LinkedAccount ${foundSpotifyAccount.id} exists but User ${foundSpotifyAccount.userId} does not`,
                );
            }

            this.logger.info(`Updating existing Spotify account ${foundSpotifyAccount.id} for user ${user.id}`);
            const isUpdated = await this.linkedAccountRepository.update(foundSpotifyAccount.id, {
                accessToken: data.spotifyAccount.accessToken,
                refreshToken: data.spotifyAccount.refreshToken,
                expiresAt: data.spotifyAccount.expiresAt,
            });
            if (!isUpdated) {
                throw new InternalServerError(`Could not update LinkedAccount ${foundSpotifyAccount.id}`);
            }

            return {
                id: user.id,
                email: user.email,
                spotifyAccount: {
                    ...foundSpotifyAccount,
                    accessToken: data.spotifyAccount.accessToken,
                    refreshToken: data.spotifyAccount.refreshToken,
                    expiresAt: data.spotifyAccount.expiresAt,
                },
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }

        let user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            user = {
                id: randomUUID(),
                email: data.email,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            this.logger.info(`Creating new user for email ${data.email} with ID: ${user.id}`);
            await this.userRepository.save(user);
        }

        const spotifyAccount = {
            id: randomUUID(),
            userId: user.id,
            provider: "spotify",
            providerUserId: data.spotifyAccount.userId,
            accessToken: data.spotifyAccount.accessToken,
            refreshToken: data.spotifyAccount.refreshToken,
            expiresAt: data.spotifyAccount.expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.logger.info(`Creating new Spotify linked account ${spotifyAccount.id} for user ${user.id}`);
        await this.linkedAccountRepository.save(spotifyAccount);

        return {
            id: user.id,
            email: user.email,
            spotifyAccount,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
