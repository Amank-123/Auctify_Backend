import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
    loginUserDB,
    registerUserDB,
    forgotPasswordDB,
    resetForgottenPasswordDB,
} from "../services/auth.service.js";
import { User } from "../models/user.model.js";
import { verifyRefreshToken } from "../utils/jwtVerification.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
};

const accessTokenOptions = {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
};

const refreshTokenOptions = {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.file);
    const user = await registerUserDB(req.body);

    return res.status(200).json({
        success: true,
        message: "User registered successfully need verification",
        data: user,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const { user, accessToken, refreshToken } = await loginUserDB(
        email,
        password
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json({
            success: true,
            message: "User logged in successfully",
            data: user,
        });
});

const forgotPassword = asyncHandler(async (req, res) => {
    const user = await forgotPasswordDB(req.body.email);
    if (!user) throw new ApiError(404, "User not found check email");

    return ApiResponse(res, 200, "Reset Otp sent successfully");
});

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await resetForgottenPasswordDB(email, password);
    if (!user) throw new ApiError(404, "User not found check email");

    return ApiResponse(res, 200, "Password changed successfully");
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        throw new ApiError(401, "NO_REFRESH_TOKEN");
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded._id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
        throw new ApiError(401, "INVALID_REFRESH_TOKEN");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, accessTokenOptions)
        .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
        .json({
            success: true,
            message: "Session updated successfully",
        });
});

const logoutUser = asyncHandler(async (req, res) => {
    if (req.user?._id) {
        await User.findByIdAndUpdate(req.user._id, {
            $set: { refreshToken: "" },
        });
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
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
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .redirect(`${process.env.CLIENT_URL}/auth/success`);
});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    oauthCallback,
    resetForgottenPassword,
    forgotPassword,
};
