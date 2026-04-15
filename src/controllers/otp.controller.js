import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyOtpDB, sendOtpDB } from "../services/otp.service.js";
import { User } from "../models/user.model.js";
const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await sendOtpDB(email);

    res.json({ message: "OTP resent" });
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const { accessToken, refreshToken } = await verifyOtpDB(email, otp);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .redirect(`${process.env.CLIENT_URL}/auth/success`);
});

export { verifyOTP, resendOTP };
