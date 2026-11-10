import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((err) => ({
                field: err.path.join(""),
                message: err.message,
            }));

            // return res.status(400).json({
            //     message: "Validation failed",
            //     errors,
            // });

            throw new AppError(400, errors.map((e) => `${e.field}: ${e.message}`).join(", "));
        }

        req.body = result.data;

        next();
    };
};