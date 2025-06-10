import { v2 as cloudinary} from "cloudinary";

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY } from "../../secret";


cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});


export const cloudinaryUploadedImage = async (fileToUpload: string): Promise<{ url: string }> => {
    try {
        const result = await cloudinary.uploader.upload(fileToUpload);
        return {
            url: result.secure_url,
        };
    } catch (error: any) {
        throw new Error('Cloudinary upload failed: ' + error.message);
    }
};

