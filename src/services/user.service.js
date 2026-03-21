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

const updateUserDB = async (userId, payload) => {
    console.log(payload)
    const updatedUser = User.findByIdAndUpdate(
        userId,
        { $set:  payload  },
        { returnDocument: "after", runValidators: true }
    );
    if (!updatedUser) throw new ApiError(404, "User not found");

    return updatedUser;
};

export { registerUserDB, updateUserDB };
