import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { commentService } from "./comment.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createCommentController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await commentService.createComment(id as string, req.userId as string, req.body);

    sendResponse(res, 201, {
        success: true,
        message: "Comment created successfully",
        data: result
    });
});

export const getCommentsByPostIdController = catchAsync(async (req: Request, res: Response) => {
    const { limit, cursor } = req.query;
    const { postId } = req.params;
    const parsedLimit = limit ? parseInt(limit as string) : 10;

    const result = await commentService.getCommentsByPostId(postId as string, parsedLimit, cursor as string);

    sendResponse(res, 200, {
        success: true,
        message: "Comments fetched successfully",
        data: result
    });
});

export const deleteCommentController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await commentService.deleteComment(id as string, req.userId as string);

    sendResponse(res, 200, {
        success: true,
        message: "Comment deleted successfully"
    });
});