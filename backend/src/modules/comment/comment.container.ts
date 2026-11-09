import { postRepository } from "../post/post.container.js";
import { CommentRepository } from "./comment.repository.js";
import { CommentService } from "./comment.service.js";

const commentRepository = new CommentRepository();
export const commentService = new CommentService(commentRepository, postRepository);