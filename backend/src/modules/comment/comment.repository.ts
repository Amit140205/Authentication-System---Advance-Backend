import { prisma } from "../../lib/prisma.js";
import { ICommentRepository } from "./comment.interface.js";
import { CreateCommentDTO } from "./comment.schema.js";

export class CommentRepository implements ICommentRepository {
    async createComment(postId: string, userId: string, data: CreateCommentDTO): Promise<any> {
        const newComment = await prisma.comment.create({
            data: {
                comment: data.comment,
                postId,
                userId
            }
        });

        return newComment;
    }

    async getCommentById(commentId: string): Promise<any> {
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

    async deleteComment(commentId: string): Promise<any> {
        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });
    }
}