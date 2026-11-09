import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import { createPostController, deletePostController, getAllPostsController, getUserPostsController, updatePostController } from "./post.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authService } from "../auth/auth.container.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/create").post(
    verifyUser(authService),
    upload.single("media"),
    validate(createPostSchema),
    createPostController
);

router.route("/all-posts").get(
    getAllPostsController
)

router.route("/your-posts").get(
    verifyUser(authService),
    getUserPostsController
);

router.route("/update-post/:id").patch(
    verifyUser(authService),
    validate(updatePostSchema),
    updatePostController
);

router.route("/delete-post/:id").delete(
    verifyUser(authService),
    deletePostController
);

export default router;