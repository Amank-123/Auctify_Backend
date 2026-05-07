import uploadToCloudinary from "../utils/cloudinaryUploader.js";
import { ApiError } from "../utils/ApiError.js";

const uploadMedia = async (req, res) => {
    const file = req.file;
    if (!file) throw new ApiError(400, "Media not uploaded");
    const media = await uploadToCloudinary(file.buffer, file.mime);
    return {
        url: media.secure_url,
        public_id: media.public_id,
    };
};

export default uploadMedia;
 