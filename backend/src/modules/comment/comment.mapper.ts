import { Comment } from "../../../generated/prisma/index.js";
import { CommentListItem } from "./comment.response.js";

export const toCommentListResponse = (comments: Comment[]): CommentListItem[] => {
    return comments.map((comment) => ({
        id: comment.id,
        comment: comment.comment,
        postId: comment.postId,
        userId: comment.userId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    }))
}