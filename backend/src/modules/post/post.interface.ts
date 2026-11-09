import { Post, Prisma } from "../../../generated/prisma/index.js";
import { UpdatePostDTO } from "./post.schema.js";

export type PostWithComment = Prisma.PostGetPayload<{
    include: {
        comment: true;
    };
}>;

export interface IPostRepository {
    createPost(
        title: string,
        description: string,
        userId: string,
        imageUrl?: string,
    ): Promise<Post>;
    getAllPosts(): Promise<PostWithComment[]>;
    getPostByPostId(post: string): Promise<Post | null>;
    getPostsByUserId(userId: string): Promise<PostWithComment[]>;
    getPostByPostIdAndUserId(postId: string, userId: string): Promise<Post | null>;
    updatePost(postId: string, data: UpdatePostDTO): Promise<Post>;
    deletePost(postId: string): Promise<void>;
} 