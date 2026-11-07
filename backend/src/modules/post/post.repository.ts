import { prisma } from "../../lib/prisma.js";
import { IPostRepository } from "./post.interface.js";

export class PostRepository implements IPostRepository {
    async createPost(title: string, description: string, userId: string, imageUrl?: string): Promise<any> {
        const createdPost = await prisma.post.create({
            data: {
                title,
                description,
                userId,
                ...(imageUrl && { imageUrl })
            }
        });

        return createdPost;
    }
}