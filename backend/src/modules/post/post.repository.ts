import { Post } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IPostRepository } from "./post.interface.js";
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

    async getAllPosts(limit: number, cursor?: string,): Promise<Post[]> {

        // GET /api/v1/post?limit=3 => take: 3, skip: 0, cursor: undefined
        // return { "posts": ["Post A", "Post B", "Post C"] }

        // Important
        // GET /api/v1/post?limit=3&cursor=POST_C_ID => take: 3, skip: 1, cursor: { id: "POST_C_ID" }
        // { "posts": ["Post D", "Post E", "Post F"] }

        const posts = await prisma.post.findMany({
            take: limit, // Fetch limited no of records.
            skip: cursor ? 1 : 0, // Find the position of the record identified by this ID.
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                createdAt: "desc"
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

    async getPostsByUserId(userId: string, limit: number, cursor?: string): Promise<Post[]> {
        const posts = await prisma.post.findMany({
            where: {
                userId
            },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                createdAt: "desc"
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