import cloudinary from "../config/cloudinary.js";
const uploadToCloudinary = (fileBuffer, mimeType) => {
 const resourceType = mimeType?.includes("video") ? "video" : "image";
    return new Promise((res, rej) => {
       const Stream= cloudinary.uploader.upload_stream(
            {
                folder: `app-uploads/${resourceType}`,
                resource_type: resourceType,
                // moderation: "aws_rek",  /* coming soon */
            },
            async (error, result) => {
                if (error) return rej(error);

                // if (
                //     result.moderation?.[0] &&
                //     result.moderation?.[0].status !== "approved"
                // ) {
                //     await cloudinary.uploader.destroy(result.public_id);
                //     return reject(
                //         new Error("Inappropriate content detected 🚫")
                //     );
                // }

                res(result);
            }
        );
        Stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;
