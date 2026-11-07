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