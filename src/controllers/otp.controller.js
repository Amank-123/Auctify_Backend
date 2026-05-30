import { asyncHandler } from "../utils/asyncHandler.js";
import {
    verifyOtpDB,
    sendOtpDB,
    verifyForgotPasswordOTPDB,
} from "../services/otp.service.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const resendOTP = asyncHandler(async (req, res) => {
    console.log("🚨 RESEND CONTROLLER HIT 🚨");

    const { email } = req.body;

    await sendOtpDB(email);

    res.json({ message: "OTP resent" });
});
const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
};

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const { user, accessToken, refreshToken } = await verifyOtpDB(email, otp);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ success: true, message: "Verified successfully", data: user });
});

const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await verifyForgotPasswordOTPDB(email, otp);

    return ApiResponse(res, 200, "Otp verified");
});

export { verifyOTP, verifyForgotPasswordOTP, resendOTP };
