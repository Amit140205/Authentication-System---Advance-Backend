import { CloudinaryService } from "../../services/file/cloudinary.service.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";

export const postRepository = new PostRepository();
const fileService = new CloudinaryService()
export const postService = new PostService(postRepository, fileService);