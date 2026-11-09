import { Comment, Prisma } from "../../../generated/prisma/index.js";
import { CreateCommentDTO } from "./comment.schema.js";

export type CommentWithPost = Prisma.CommentGetPayload<{
    include: {
        post: true;
    };
}>;

export interface ICommentRepository {
    createComment(postId: string, userId: string, data: CreateCommentDTO): Promise<Comment>;
    getCommentById(commentId: string): Promise<CommentWithPost | null>;
    deleteComment(commentId: string): Promise<void>;
}