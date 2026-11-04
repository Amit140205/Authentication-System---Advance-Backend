import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import { JwtPayload } from "../types/index.js";
import { authRepository } from "../modules/auth/auth.repository.js";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new AppError(401, "Unauthorized request");
        }

        const decoded = verifyAccessToken(token) as JwtPayload;

        const user = await authRepository.findUserById(decoded.userId);

        if (!user) {
            throw new AppError(401, "Unauthorized request");
        }

        req.userId = user.id;

        next();
    } catch (error) {
        next(new AppError(401, "Invalid or expired token"));
    }

};