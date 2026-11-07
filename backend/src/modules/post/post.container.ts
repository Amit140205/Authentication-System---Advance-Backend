import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";

const postRepository = new PostRepository();
export const postService = new PostService(postRepository);