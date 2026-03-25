import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { loginUserDB } from "../services/auth.service.js";
import { User } from "../models/user.model.js";

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email && !password)
        throw new ApiError(400, "Username and password are required");

    const { user, accessToken, refreshToken } = await loginUserDB(
        email,
        password
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User logged in successfully",
            user,
        });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies("refreshToken");
    if (!token) throw new ApiError(401, "Unauthroized access token not found");

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded._id).select("+refreshToken");
    if (!user || user.refreshToken !== token)
        throw new ApiError(401, "Invalid Refresh Token");

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            success: true,
            message: "Session updated successfully",
        });
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } });

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({
            success: true,
            message: "User logged out successfully",
        });
});

const oauthCallback = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "Authentication successfully done",
        });
});
export { loginUser, refreshAccessToken, logoutUser, oauthCallback };
