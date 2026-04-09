import cloudinary from "../config/cloudinary.js";
const uploadToCloudinary = (fileBuffer, mimeType) => {
    const resouceType = mimeType.startsWith("video") ? "video" : "image";
    return new Promise((res, rej) => {
        cloudinary.uploader.upload_stream(
            {
                folder: `app-uploads/${resouceType}`,
                resource_type: resouceType,
                moderation: "aws_rek",
            },
            async (error, result) => {
                if (error) return rej(error);
                if (
                    result.moderation?.[0] &&
                    result.moderation?.[0].status !== "approved"
                ) {
                    await cloudinary.uploader.destroy(result.public_id);
                    return reject(
                        new Error("Inappropriate content detected 🚫")
                    );
                }
                res(result);
            }
        );
        Stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;
