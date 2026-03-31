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

    await verifyOtpDB(email, otp);

    res.json({ message: "Email verified" });
});

export { verifyOTP, resendOTP };
