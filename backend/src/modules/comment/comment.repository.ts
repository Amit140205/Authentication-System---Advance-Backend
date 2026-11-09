import { Comment } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { CommentWithPost, ICommentRepository } from "./comment.interface.js";
import { CreateCommentDTO } from "./comment.schema.js";

export class CommentRepository implements ICommentRepository {
    async createComment(postId: string, userId: string, data: CreateCommentDTO): Promise<Comment> {
        const newComment = await prisma.comment.create({
            data: {
                comment: data.comment,
                postId,
                userId
            }
        });

        return newComment;
    }

    async getCommentById(commentId: string): Promise<CommentWithPost | null> {
        const comment = await prisma.comment.findUnique({
            where: {
                id: commentId
            },
            include: {
                post: true
            }
        });

        return comment;
    }

    async deleteComment(commentId: string): Promise<void> {
        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });
    }
}