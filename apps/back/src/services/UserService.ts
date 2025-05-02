import { randomUUID } from "node:crypto";
import type { OmitDeep } from "type-fest";
import type Logger from "@/Logger.js";
import type UserRepository from "@/repositories/UserRepository.js";
import type LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";
import InternalServerError from "@/errors/InternalServerError.js";
import NotFoundError from "@/errors/NotFoundError.js";

interface SpotifyAccount {
    id: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
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

    async getById(id: string): Promise<Omit<User, "spotifyAccount">> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError();
        }

        return user;
    }

    async upsert(
        data: OmitDeep<
            User,
            | "id"
            | "createdAt"
            | "updatedAt"
            | "spotifyAccount.id"
            | "spotifyAccount.createdAt"
            | "spotifyAccount.updatedAt"
        >,
    ): Promise<User> {
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

            const toUpdate = {
                accessToken: data.spotifyAccount.accessToken,
                refreshToken: data.spotifyAccount.refreshToken,
                expiresAt: data.spotifyAccount.expiresAt,
            };

            this.logger.info(`Updating existing Spotify account ${foundSpotifyAccount.id} for user ${user.id}`);
            const isUpdated = await this.linkedAccountRepository.update(foundSpotifyAccount.id, toUpdate);
            if (!isUpdated) {
                throw new InternalServerError(`Could not update LinkedAccount ${foundSpotifyAccount.id}`);
            }

            return {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                spotifyAccount: {
                    ...foundSpotifyAccount,
                    ...toUpdate,
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
                displayName: data.displayName,
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
            displayName: user.displayName,
            spotifyAccount,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
