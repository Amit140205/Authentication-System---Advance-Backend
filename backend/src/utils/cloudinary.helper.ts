import fs from "fs/promises";
import cloudinary from "../lib/cloudinary.js";
import { AppError } from "./AppError.js";

export const uploadToCloudinary = async (localFilePath: string): Promise<string> => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "image" });
        
        return response.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new AppError(500, "Failed to upload image");
    } finally {
        await fs.unlink(localFilePath).catch((cleanupError) => {
            console.error("Failed to remove temporary file:", cleanupError);
        });
    }
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
    try {
        const publicId = imageUrl.split("/").pop()?.split(".")[0] as string;
        if (!publicId) {
            throw new AppError(400, "Invalid Cloudinary image URL");
        }
        const response = await cloudinary.uploader.destroy(publicId);

        if (response.result !== "ok" && response.result !== "not found") {
            throw new AppError(500, "Failed to delete image");
        }
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        console.error("Cloudinary deletion failed:", error);

        throw new AppError(500, "Failed to delete image");
    }
}