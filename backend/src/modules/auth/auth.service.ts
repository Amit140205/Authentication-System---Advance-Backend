import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/auth.helper.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.helper.js";
import { toUserResponse } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import { RegisterUserDTO } from "./auth.schema.js";

export const authService = {
    registerUser: async (body: RegisterUserDTO) => {
        const { userName, email, password } = body;

        const existingUserByUserName = await authRepository.findUserByUserName(userName);

        if (existingUserByUserName) {
            throw new AppError(400, "User already existed");
        }

        const existingUserByEmail = await authRepository.findUserByEmail(email);

        if (existingUserByEmail) {
            throw new AppError(400, "User already existed");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await authRepository.createUser(userName, email, hashedPassword);

        const accessToken = generateAccessToken(newUser.id);
        const refreshToken = generateRefreshToken(newUser.id);

        await authRepository.createRefreshToken({
            token: refreshToken,
            userId: newUser.id,
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return {
            user: toUserResponse(newUser),
            accessToken,
            refreshToken
        }
    }
};