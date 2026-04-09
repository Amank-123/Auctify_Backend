import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOtpDB } from "../services/otp.service.js";

const registerUserDB = async (data, file) => {
    if (!file) throw new ApiError(404, "Image is not uploaded");
    if (!file.mimetype.startsWith("image"))
        throw new ApiError(400, "Profile should be type image");
    const media = await uploadToCloudinary(file.buffer, file.mimetype);

    const user = await User.create({
        ...data,
        isVerified: false,
        profile: media.secure_url,
    });
    await sendOtpDB(user.email);
    return user;
};

const getUserDB = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    return user;
};

const updateUserDB = async (userId, payload, file) => {
    if (file) {
        const media = await uploadToCloudinary(file.buffer, file.mimetype);
        if (!file.mimetype.startsWith("image"))
            throw new ApiError(400, "Profile should be type image");
        payload.media = media.secure_url;
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: payload },
        { returnDocument: "after", runValidators: true }
    );
    if (!updatedUser) throw new ApiError(404, "User not found");

    return updatedUser;
};

const deleteUserDB = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new ApiError(404, "User not found");
    return deletedUser;
};
export { registerUserDB, updateUserDB, deleteUserDB, getUserDB };
