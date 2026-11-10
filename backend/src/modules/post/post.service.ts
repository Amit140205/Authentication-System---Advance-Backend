import { IFileService } from "../../services/file/file.interface.js";
import { AppError } from "../../utils/AppError.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IPostRepository } from "./post.interface.js";
import { toPostListResponse } from "./post.mapper.js";
import { CreatePostDTO, UpdatePostDTO } from "./post.schema.js";

export class PostService {
    constructor(private repo: IPostRepository, private fileRepo: IFileService) { };

    async createPost(body: CreatePostDTO, userId: string, localFilePath?: string) {
        const { title, description } = body;
        let imageUrl: string | undefined;

        if (localFilePath) {
            imageUrl = await this.fileRepo.upload(localFilePath);
        }

        const createdPost = await this.repo.createPost(title, description, userId, imageUrl);

        return createdPost;
    }

    async getAllPosts(limit: number, cursor?: string) {
        const posts = await this.repo.getAllPosts(limit, cursor);

        return {
            posts: toPostListResponse(posts),
            meta: {
                nextCursor: posts.length > 0 ? posts[posts.length - 1].id : null
            }
        };
    }

    async getUserPosts(userId: string, limit: number, cursor?: string) {
        const posts = await this.repo.getPostsByUserId(userId, limit, cursor);

        return {
            posts: toPostListResponse(posts),
            meta: {
                nextCursor: posts.length > 0 ? posts[posts.length - 1].id : null
            }
        };;
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
            await this.fileRepo.delete(post.imageUrl);
        }

        await this.repo.deletePost(postId);
    }
}