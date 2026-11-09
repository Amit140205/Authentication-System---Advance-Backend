import { UpdatePostDTO } from "./post.schema.js";

export interface IPostRepository {
    createPost(
        title: string,
        description: string,
        userId: string,
        imageUrl?: string,
    ): Promise<any>;
    getAllPosts(): Promise<any>;
    getPostByPostId(post: string): Promise<any>;
    getPostsByUserId(userId: string): Promise<any>;
    getPostByPostIdAndUserId(postId: string, userId: string): Promise<any>;
    updatePost(postId: string, data: UpdatePostDTO): Promise<any>;
    deletePost(postId: string): Promise<any>;
} 