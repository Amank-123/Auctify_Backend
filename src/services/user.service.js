import { User } from "../models/user.model.js";
import { Auction } from "../models/auction.model.js";
import { ApiError } from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/cloudinaryUploader.js";

const getUserDB = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    return user;
};

const updateUserDB = async (userId, payload, file) => {
    try {
        if (file) {
            const media = await uploadToCloudinary(file.buffer, file.mimetype);

            if (!file.mimetype.startsWith("image"))
                throw new ApiError(400, "Profile should be type image");

            payload.profile = media.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: payload },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!updatedUser) throw new ApiError(404, "User not found");

        return updatedUser;
    } catch (error) {
        console.log("UPDATE USER ERROR:");
        console.log(error);

        throw error;
    }
};

const deleteUserDB = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new ApiError(404, "User not found");
    return deletedUser;
};

const toggleWatchListDB = async (userId, AuctionId) => {
    const user = await User.findById(userId);
    const auction = await Auction.findById(AuctionId);
    if (auction.sellerId.toString() === userId.toString()) {
        throw new ApiError("You cannot watchlist your own auction");
    }
    const find = user.watchList.some((id) => id.toString() === AuctionId);
    if (!find) {
        user.watchList.unshift(AuctionId);
    } else {
        user.watchList = user.watchList.filter(
            (id) => id.toString() !== AuctionId
        );
    }
    await user.save();
    return { watchList: user, exist: !find };
};

const fetchWatchListDB = async (userId) => {
    const user = await User.findById(userId).populate("watchList");
    return user.watchList;
};

const resetPasswordDB = async (userId, oldPass, newPass) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new ApiError("User not found!");
    }
    const isVerified = await user.comparePassword(oldPass);

    if (!isVerified) {
        return { reset: "Failed" };
    }
    user.password = newPass;
    await user.save();
    return { reset: "Success" };
};
export {
    updateUserDB,
    deleteUserDB,
    getUserDB,
    toggleWatchListDB,
    fetchWatchListDB,
    resetPasswordDB,
};
