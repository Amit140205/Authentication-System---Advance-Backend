import { Post, Prisma } from "../../../generated/prisma/index.js";
import { UpdatePostDTO } from "./post.schema.js";

// export type PostWithComment = Prisma.PostGetPayload<{
//     include: {
//         comment: true;
//     };
// }>;

export interface IPostRepository {
    createPost(
        title: string,
        description: string,
        userId: string,
        imageUrl?: string,
    ): Promise<Post>;
    getAllPosts(limit: number, cursor?: string,): Promise<Post[]>;
    getPostByPostId(post: string): Promise<Post | null>;
    getPostsByUserId(userId: string, limit: number, cursor?: string): Promise<Post[]>;
    getPostByPostIdAndUserId(postId: string, userId: string): Promise<Post | null>;
    updatePost(postId: string, data: UpdatePostDTO): Promise<Post>;
    deletePost(postId: string): Promise<void>;
} 