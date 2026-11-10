import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { postService } from "./post.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createPostController = catchAsync(async (req: Request, res: Response) => {
    const result = await postService.createPost(req.body, req.userId as string, req.file?.path);

    sendResponse(res, 201, {
        success: true,
        message: "Post created successfully",
        data: result
    });
});

export const getAllPostsController = catchAsync(async (req: Request, res: Response) => {
    const { limit, cursor } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 10;

    const result = await postService.getAllPosts(parsedLimit, cursor as string);

    sendResponse(res, 200, {
        success: true,
        message: "Posts fetched successfully",
        data: result
    });
});

export const getUserPostsController = catchAsync(async (req: Request, res: Response) => {
    const { limit, cursor } = req.query;
    const parsedLimit = limit ? parseInt(limit as string) : 10;

    const result = await postService.getUserPosts(req.userId as string, parsedLimit, cursor as string);

    sendResponse(res, 200, {
        success: true,
        message: "User posts fetched successfully",
        data: result
    });
});

export const updatePostController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await postService.updatePost(id as string, req.userId as string, req.body);

    sendResponse(res, 200, {
        success: true,
        message: "Post updated successfully",
        data: result
    });
});

export const deletePostController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await postService.deletePost(id as string, req.userId as string);

    sendResponse(res, 200, {
        success: true,
        message: "Post deleted successfully",
    });
});