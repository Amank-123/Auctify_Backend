import { Otp } from "../models/otp.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/otp.js";

const generateOtp = async () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpDB = async (email) => {
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });
    await Otp.create({
        email,
        opt: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await sendEmail(email, otp);
};

const verifyOtpDB = async (email, otp) => {
    const record = await Otp.findOne({ email });
    if (!record) throw new ApiError("OTP not found");
    if (record.expiresAt < Date.now()) throw new ApiError("OTP not found");
    const isMatch = await bcrypt.compare(otp, record.opt);
    if (!isMatch) throw new Error("Invalid OTP");

    await OTP.deleteMany({ email });
};

export { verifyOtpDB, sendOtpDB };
