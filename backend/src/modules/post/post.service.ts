import { AppError } from "../../utils/AppError.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IPostRepository } from "./post.interface.js";
import { CreatePostDTO, UpdatePostDTO } from "./post.schema.js";

export class PostService {
    constructor(private repo: IPostRepository) { };

    async createPost(body: CreatePostDTO, userId: string, localFilePath?: string) {
        const { title, description } = body;
        let imageUrl: string | undefined;

        if (localFilePath) {
            imageUrl = await uploadToCloudinary(localFilePath);
        }

        const createdPost = await this.repo.createPost(title, description, userId, imageUrl);

        return createdPost;
    }

    async getAllPosts() {
        const posts = await this.repo.getAllPosts();

        return posts;
    }

    async getUserPosts(userId: string) {
        const posts = await this.repo.getPostsByUserId(userId);

        return posts;
    }

    async updatePost(postId: string, userId: string, data: UpdatePostDTO) {
        const post = await this.repo.getPostByPostIdAndUserId(postId, userId);

        if (!post) {
            throw new AppError(404, "Post not found");
        }

        const updatedPost = await this.repo.updatePost(postId, data);

        return updatedPost;
    }

    async deletePost(postId: string, userId: string) {
        const post = await this.repo.getPostByPostIdAndUserId(postId, userId);

        if (!post) {
            throw new AppError(404, "Post not found");
        }

        if (post.imageUrl) {
            await deleteFromCloudinary(post.imageUrl);
        }

        await this.repo.deletePost(postId);
    }
}