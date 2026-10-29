import { z } from "zod";

export const registerUserSchema = z.object({
    userName: z.string().min(3, "Username must be atleast 3 characters long"),
    email: z.email("Email is required"),
    password: z.string().min(6, "Password must be atleast 6 characetrs long")
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;