import { User, RefreshToken } from "../../../generated/prisma/index.js";

export interface IAuthRepository {
    findUserById(id: string): Promise<User | null>;
    findUserByUserName(userName: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;

    createUser(
        userName: string,
        email: string,
        password: string
    ): Promise<User>;

    createRefreshToken(
        data: {
            token: string;
            userId: string;
            expiredAt: Date;
        }
    ): Promise<RefreshToken>;
    findRefreshToken(token: string): Promise<RefreshToken | null>;
    deleteRefreshTokenById(id: string): Promise<void>;
    deleteAllRefreshTokenByUserId(userId: string): Promise<void>;
}