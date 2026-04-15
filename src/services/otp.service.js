import { Otp } from "../models/otp.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/otp.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpDB = async (email) => {
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    // console.log(hashedOtp);
    await Otp.deleteMany({ email });
    await Otp.create({
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail(email, otp);
}; 

const verifyOtpDB = async (email, otp) => {
    const record = await Otp.findOne({ email });
    if (!record) throw new ApiError("OTP not found");
    if (record.expiresAt < Date.now()) throw new ApiError("OTP is expired");
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) throw new Error("Invalid OTP");

    const user = await User.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } },
        { returnDocument: "after" }
    );

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ runValidators: false });

    await Otp.deleteMany({ email });
    return { accessToken, refreshToken };
};

export { verifyOtpDB, sendOtpDB };
