import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const registerUserDB = async (data) => {
    await User.create({
        username: data.username,
        email: data.email,
        password: data.password,
        refreshToken: "",
        address: data.address,
    });
};

const getUserDB = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    return user;
};

const updateUserDB = async (userId, payload) => {
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
