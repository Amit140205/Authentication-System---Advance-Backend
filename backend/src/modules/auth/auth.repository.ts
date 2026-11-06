import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";

export class AuthRepository implements IAuthRepository {
    async findUserById(id: string): Promise<any> {
        return await prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async findUserByUserName(userName: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                userName
            }
        });

        return user;
    }

    async findUserByEmail(email: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return user;
    }

    async createUser(userName: string, email: string, password: string): Promise<any> {
        const createdUser = await prisma.user.create({
            data: {
                userName,
                email,
                password
            }
        });

        return createdUser;
    }

    async createRefreshToken(data: { token: string; userId: string; expiredAt: Date; }): Promise<any> {
        const refreshToken = await prisma.refreshToken.create({
            data,
        });

        return refreshToken;
    }

    async findRefreshToken(token: string): Promise<any> {
        const refreshToken = await prisma.refreshToken.findUnique({
            where: {
                token
            }
        });

        return refreshToken;
    }

    async deleteRefreshTokenById(id: string): Promise<any> {
        return await prisma.refreshToken.delete({
            where: {
                id
            }
        });
    }

    async deleteAllRefreshTokenByUserId(userId: string): Promise<any> {
        return await prisma.refreshToken.deleteMany({
            where: {
                userId
            }
        });
    }
}

// export const authRepository = {
//     findUserById: async (id: string) => {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id,
//             }
//         });

//         return user;
//     },

//     findUserByUserName: async (userName: string) => {
//         const user = await prisma.user.findUnique({
//             where: {
//                 userName
//             }
//         });

//         return user;
//     },

//     findUserByEmail: async (email: string) => {
//         const user = await prisma.user.findUnique({
//             where: {
//                 email
//             }
//         });

//         return user;
//     },

//     createUser: async (userName: string, email: string, password: string) => {
//         const createdUser = await prisma.user.create({
//             data: {
//                 userName,
//                 email,
//                 password
//             }
//         });

//         return createdUser;
//     },

//     createRefreshToken: async (data: { token: string; userId: string; expiredAt: Date; }) => {
//         const refreshToken = await prisma.refreshToken.create({
//             data,
//         });

//         return refreshToken;
//     },

//     findRefreshToken: async (token: string) => {
//         const refreshToken = await prisma.refreshToken.findUnique({
//             where: {
//                 token
//             }
//         });

//         return refreshToken;
//     },

//     deleteRefreshTokenById: async (id: string) => {
//         return await prisma.refreshToken.delete({
//             where: {
//                 id
//             }
//         });
//     },

//     deleteAllRefreshTokenByUserId: async (userId: string) => {
//         return await prisma.refreshToken.deleteMany({
//             where: {
//                 userId
//             }
//         });
//     }
// };
