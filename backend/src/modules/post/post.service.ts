import { uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IPostRepository } from "./post.interface.js";
import { CreatePostDTO } from "./post.schema.js";

export class PostService {
    constructor(private repo: IPostRepository) { };

    async createPost(body: CreatePostDTO, userId: string, localFilePath?: string) {
        const { title, description } = body;
        let imageUrl: string | undefined;

        if (localFilePath) {
            imageUrl = await uploadToCloudinary(localFilePath);
        }

        const createdPost = await this.repo.createPost(title, description, userId, imageUrl);

        return createdPost;
    }
}