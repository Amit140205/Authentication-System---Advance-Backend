import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, "Post title can not be empty"),
    description: z.
        string().
        min(10, "Post description must be at least 10 characters long"),
}).strict();

export const updatePostSchema = z.object({
    title: z.string().min(1, "Post title can not be empty").optional(),
    description: z.
        string().
        min(10, "Post description must be at least 10 characters long").optional(),
}).strict();

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;