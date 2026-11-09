import { AppError } from "../../utils/AppError.js";
import { IPostRepository } from "../post/post.interface.js";
import { ICommentRepository } from "./comment.interface.js";
import { CreateCommentDTO } from "./comment.schema.js";

export class CommentService {
    constructor(private commentRepo: ICommentRepository, private postRepo: IPostRepository) { }

    async createComment(postId: string, userId: string, data: CreateCommentDTO) {
        const post = await this.postRepo.getPostByPostId(postId);

        if (!post) {
            throw new AppError(404, "Post not found");
        }

        const newComment = await this.commentRepo.createComment(postId, userId, data);
        return newComment;
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.commentRepo.getCommentById(commentId);

        if (!comment) {
            throw new AppError(404, "Comment not found");
        }

        if (!(comment.userId === userId || comment.post?.userId === userId)) {
            throw new AppError(403, "Unauthorized to perform this action");
        }

        await this.commentRepo.deleteComment(commentId);
    }
}