import { Post } from "../../../generated/prisma/index.js";
import { PostListItem } from "./post.response.js";

export const toPostListResponse = (posts: Post[]): PostListItem[] => {
    return posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        userId: post.userId
    }))
}