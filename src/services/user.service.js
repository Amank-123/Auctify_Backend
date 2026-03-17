import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUserDB = asyncHandler(async (data) => {
    await User.create({
        username: data.username,
        email: data.email,
        password: data.password,
        refreshToken: "",
        address: data.address,
    });
});

export { registerUserDB };
