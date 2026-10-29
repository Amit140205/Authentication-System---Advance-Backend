import { prisma } from "../../lib/prisma.js";

export const authRepository = {
    findUserByUserName: async (userName: string) => {
        const user = await prisma.user.findUnique({
            where: {
                userName
            }
        });

        return user;
    },

    findUserByEmail: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return user;
    },

    createUser: async (userName: string, email: string, password: string) => {
        const createdUser = await prisma.user.create({
            data: {
                userName,
                email,
                password
            }
        });

        return createdUser;
    },

    createRefreshToken: async (data: { token: string; userId: string; expiredAt: Date; }) => {
        const refreshToken = await prisma.refreshToken.create({
            data,
        });
    }
};
