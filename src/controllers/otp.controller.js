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

    await verifyOTPService(email, otp);

    const user = await User.findOne({ email });
    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified" });
});

export { verifyOTP, resendOTP };
