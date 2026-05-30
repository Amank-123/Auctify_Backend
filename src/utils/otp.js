import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
    });
};

export { sendEmail };
