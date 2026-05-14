// utils/uploadToCloudinary.js

import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, mimeType) => {
    const resourceType = mimeType?.includes("video") ? "video" : "image";

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `app-uploads/${resourceType}`,

                resource_type: resourceType,

                transformation:
                    resourceType === "image"
                        ? [
                              {
                                  quality: "auto",
                                  fetch_format: "auto",
                              },
                          ]
                        : undefined,
            },

            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};

export default uploadToCloudinary;
