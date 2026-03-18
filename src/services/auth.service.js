import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const loginUserDB = asyncHandler(async (email, password) => {
    const user = await User.findOne({ email }).select(
        "+password +refreshToken"
    );
    if (!user) throw new ApiError(404, "User not found check email");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new ApiError(401, "Incorrect Credentials");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, accessToken, refreshToken };
});

export { loginUserDB };
