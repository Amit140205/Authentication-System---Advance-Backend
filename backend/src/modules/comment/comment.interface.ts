import { CreateCommentDTO } from "./comment.schema.js";

export interface ICommentRepository{
    createComment(postId: string, userId: string, data: CreateCommentDTO): Promise<any>;
    getCommentById(commentId: string): Promise<any>;
    deleteComment(commentId: string): Promise<any>;
}