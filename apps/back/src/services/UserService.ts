import { randomUUID } from "node:crypto";
import type UserRepository from "@/repositories/UserRepository.js";
import type LinkedAccountRepository from "@/repositories/LinkedAccountRepository.js";

interface User {
    id: string;
    email: string;
    spotifyAccount: {
        id: string;
        userId: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    };
}

interface CreateUser {
    email: string;
    spotifyAccount: {
        userId: string;
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    };
}

export default class UserService {
    private readonly userRepository: UserRepository;
    private readonly linkedAccountRepository: LinkedAccountRepository;

    constructor(userRepository: UserRepository, linkedAccountRepository: LinkedAccountRepository) {
        this.userRepository = userRepository;
        this.linkedAccountRepository = linkedAccountRepository;
    }

    async create(data: CreateUser): Promise<User> {
        const user = {
            id: randomUUID(),
            email: data.email,
        };
        await this.userRepository.create(user);

        const spotifyAccount = {
            id: randomUUID(),
            userId: user.id,
            provider: "spotify",
            providerUserId: data.spotifyAccount.userId,
            accessToken: data.spotifyAccount.accessToken,
            refreshToken: data.spotifyAccount.refreshToken,
            expiresAt: data.spotifyAccount.expiresAt,
        };
        await this.linkedAccountRepository.create(spotifyAccount);

        return {
            ...user,
            spotifyAccount: spotifyAccount,
        };
    }
}
