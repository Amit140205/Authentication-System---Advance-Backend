import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IFileService } from "./file.interface.js";

export class CloudinaryService implements IFileService {
    async upload(filePath: string): Promise<string> {
        return await uploadToCloudinary(filePath);
    }

    async delete(fileUrl: string): Promise<void> {
        await deleteFromCloudinary(fileUrl);
    }
}