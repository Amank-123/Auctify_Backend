import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
    console.log("A");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    console.log("B");

    // await transporter.verify();

    console.log("C");

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
    });

    console.log("D");
};

export { sendEmail };
