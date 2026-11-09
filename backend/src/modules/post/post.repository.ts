import { prisma } from "../../lib/prisma.js";
import { IPostRepository } from "./post.interface.js";
import { UpdatePostDTO } from "./post.schema.js";

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

    async getAllPosts(): Promise<any> {
        const posts = await prisma.post.findMany();

        return posts;
    }

    async getPostsByUserId(userId: string): Promise<any> {
        const posts = await prisma.post.findMany({
            where: {
                userId
            }
        });

        return posts;
    }

    async getPostByPostIdAndUserId(postId: string, userId: string): Promise<any> {
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                userId
            }
        });

        return post;
    }

    async updatePost(postId: string, data: UpdatePostDTO): Promise<any> {
        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                title: data.title,
                description: data.description
            }
        });

        return updatedPost;
    }

    async deletePost(postId: string): Promise<any> {
        await prisma.post.delete({
            where: {
                id: postId
            }
        });
    }
}