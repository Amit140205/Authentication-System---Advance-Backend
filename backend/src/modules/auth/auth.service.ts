import { JwtPayload } from "../../types/index.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword, hashPassword, hashRefreshToken } from "../../utils/auth.helper.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toUserResponse } from "./auth.mapper.js";
import { LoginUserDTO, RefreshTokenDTO, RegisterUserDTO } from "./auth.schema.js";

export class AuthService {
    constructor(private repo: IAuthRepository) { };

    async registerUser(body: RegisterUserDTO) {
        const { userName, email, password } = body;

        const existingUserByUserName = await this.repo.findUserByUserName(userName);

        if (existingUserByUserName) {
            throw new AppError(400, "User already existed");
        }

        const existingUserByEmail = await this.repo.findUserByEmail(email);

        if (existingUserByEmail) {
            throw new AppError(400, "User already existed");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await this.repo.createUser(userName, email, hashedPassword);

        const accessToken = generateAccessToken(newUser.id);
        const refreshToken = generateRefreshToken(newUser.id);

        const hashedRefreshToken = hashRefreshToken(refreshToken);

        await this.repo.createRefreshToken({
            token: hashedRefreshToken,
            userId: newUser.id,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return {
            user: toUserResponse(newUser),
            accessToken,
            refreshToken
        };
    }

    async loginUser(body: LoginUserDTO) {
        const { email, password } = body;

        const user = await this.repo.findUserByEmail(email);

        if (!user) {
            throw new AppError(404, "Invalid credentials");
        }

        const isPassword = await comparePassword(password, user.password);

        if (!isPassword) {
            throw new AppError(404, "Invalid credentials");
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        const hashedRefreshToken = hashRefreshToken(refreshToken);

        await this.repo.createRefreshToken({
            token: hashedRefreshToken,
            userId: user.id,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return {
            user: toUserResponse(user),
            accessToken,
            refreshToken
        };
    }

    async refreshToken(body: RefreshTokenDTO) {
        const { token } = body;

        if (!token) {
            throw new AppError(401, "Refresh token required");
        }

        let decoded;

        try {
            decoded = verifyRefreshToken(token) as JwtPayload;
        } catch {
            throw new AppError(403, "Invalid or expired refresh token");
        }

        const hashedRefreshToken = hashRefreshToken(token);

        const existingToken = await this.repo.findRefreshToken(hashedRefreshToken);

        if (!existingToken) {
            throw new AppError(403, "Refresh token not found");
        }

        await this.repo.deleteRefreshTokenById(existingToken.id);

        const newAccessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        const newHashedRefreshToken = hashRefreshToken(newRefreshToken);

        await this.repo.createRefreshToken({
            token: newHashedRefreshToken,
            userId: decoded.userId,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.repo.findUserById(userId);

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return {
            user: toUserResponse(user)
        };
    }

    async logout(refreshToken: string) {
        if (!refreshToken) {
            throw new AppError(401, "Refresh token required");
        };

        const hashedRefreshToken = hashRefreshToken(refreshToken);

        const existingToken = await this.repo.findRefreshToken(hashedRefreshToken);

        if (!existingToken) {
            throw new AppError(404, "Invalid refresh token");
        }

        await this.repo.deleteRefreshTokenById(existingToken.id);

        return true;
    }

    async logoutAllDevices(userId: string) {
        if (!userId) {
            throw new AppError(404, "User id not found");
        }

        await this.repo.deleteAllRefreshTokenByUserId(userId);

        return true;
    }
}

// export const authService = {
//     registerUser: async (body: RegisterUserDTO) => {
//         const { userName, email, password } = body;

//         const existingUserByUserName = await authRepository.findUserByUserName(userName);

//         if (existingUserByUserName) {
//             throw new AppError(400, "User already existed");
//         }

//         const existingUserByEmail = await authRepository.findUserByEmail(email);

//         if (existingUserByEmail) {
//             throw new AppError(400, "User already existed");
//         }

//         const hashedPassword = await hashPassword(password);

//         const newUser = await authRepository.createUser(userName, email, hashedPassword);

//         const accessToken = generateAccessToken(newUser.id);
//         const refreshToken = generateRefreshToken(newUser.id);

//         const hashedRefreshToken = hashRefreshToken(refreshToken);

//         await authRepository.createRefreshToken({
//             token: hashedRefreshToken,
//             userId: newUser.id,
//             expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//         });

//         return {
//             user: toUserResponse(newUser),
//             accessToken,
//             refreshToken
//         };
//     },

//     loginUser: async (body: LoginUserDTO) => {
//         const { email, password } = body;

//         const user = await authRepository.findUserByEmail(email);

//         if (!user) {
//             throw new AppError(404, "Invalid credentials");
//         }

//         const isPassword = await comparePassword(password, user.password);

//         if (!isPassword) {
//             throw new AppError(404, "Invalid credentials");
//         }

//         const accessToken = generateAccessToken(user.id);
//         const refreshToken = generateRefreshToken(user.id);

//         const hashedRefreshToken = hashRefreshToken(refreshToken);

//         await authRepository.createRefreshToken({
//             token: hashedRefreshToken,
//             userId: user.id,
//             expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//         });

//         return {
//             user: toUserResponse(user),
//             accessToken,
//             refreshToken
//         };
//     },

//     refreshToken: async (body: RefreshTokenDTO) => {
//         const { token } = body;

//         if (!token) {
//             throw new AppError(401, "Refresh token required");
//         }

//         let decoded;

//         try {
//             decoded = verifyRefreshToken(token) as JwtPayload;
//         } catch {
//             throw new AppError(403, "Invalid or expired refresh token");
//         }

//         const hashedRefreshToken = hashRefreshToken(token);

//         const existingToken = await authRepository.findRefreshToken(hashedRefreshToken);

//         if (!existingToken) {
//             throw new AppError(403, "Refresh token not found");
//         }

//         await authRepository.deleteRefreshTokenById(existingToken.id);

//         const newAccessToken = generateAccessToken(decoded.userId);
//         const newRefreshToken = generateRefreshToken(decoded.userId);

//         const newHashedRefreshToken = hashRefreshToken(newRefreshToken);

//         await authRepository.createRefreshToken({
//             token: newHashedRefreshToken,
//             userId: decoded.userId,
//             expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//         });

//         return {
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken
//         };
//     },

//     getCurrentUser: async (userId: string) => {
//         const user = await authRepository.findUserById(userId);

//         if (!user) {
//             throw new AppError(404, "User not found");
//         }

//         return {
//             user: toUserResponse(user)
//         };
//     },

//     logout: async (refreshToken: string) => {
//         if (!refreshToken) {
//             throw new AppError(401, "Refresh token required");
//         };

//         const hashedRefreshToken = hashRefreshToken(refreshToken);

//         const existingToken = await authRepository.findRefreshToken(hashedRefreshToken);

//         if (!existingToken) {
//             throw new AppError(404, "Invalid refresh token");
//         }

//         await authRepository.deleteRefreshTokenById(existingToken.id);

//         return true;
//     },

//     logoutAllDevices: async (userId: string) => {
//         if (!userId) {
//             throw new AppError(404, "User id not found");
//         }

//         await authRepository.deleteAllRefreshTokenByUserId(userId);

//         return true;
//     }
// };