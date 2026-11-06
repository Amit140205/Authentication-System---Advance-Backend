export interface IAuthRepository {
    findUserById(id: string): Promise<any>;
    findUserByUserName(userName: string): Promise<any>;
    findUserByEmail(email: string): Promise<any>;

    createUser(
        userName: string,
        email: string,
        password: string
    ): Promise<any>;

    createRefreshToken(
        data: {
            token: string;
            userId: string;
            expiredAt: Date;
        }
    ): Promise<any>;
    findRefreshToken(token: string): Promise<any>;
    deleteRefreshTokenById(id: string): Promise<any>;
    deleteAllRefreshTokenByUserId(userId: string): Promise<any>;
}