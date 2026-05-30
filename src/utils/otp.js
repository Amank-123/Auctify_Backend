import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: Number(process.env.BREVO_PORT),
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_SMTP_KEY,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.BREVO_USER,
        to: email,
        subject: "OTP Verification",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Auctify OTP Verification</h2>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
            </div>
        `,
    });

    console.log("MAIL SENT:", info.messageId);
};

export { sendEmail };
