import { Post } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IPostRepository, PostWithComment } from "./post.interface.js";
import { UpdatePostDTO } from "./post.schema.js";

export class PostRepository implements IPostRepository {
    async createPost(title: string, description: string, userId: string, imageUrl?: string): Promise<Post> {
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

    async getAllPosts(): Promise<PostWithComment[]> {
        const posts = await prisma.post.findMany({
            include: {
                comment: true
            }
        });

        return posts;
    }

    async getPostByPostId(postId: string): Promise<Post | null> {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        return post;
    }

    async getPostsByUserId(userId: string): Promise<PostWithComment[]> {
        const posts = await prisma.post.findMany({
            where: {
                userId
            },
            include: {
                comment: true
            }
        });

        return posts;
    }

    async getPostByPostIdAndUserId(postId: string, userId: string): Promise<Post | null> {
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                userId
            }
        });

        return post;
    }

    async updatePost(postId: string, data: UpdatePostDTO): Promise<Post> {
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

    async deletePost(postId: string): Promise<void> {
        await prisma.post.delete({
            where: {
                id: postId
            }
        });
    }
}