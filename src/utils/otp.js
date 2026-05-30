import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
    try {
        console.log("=== EMAIL START ===");

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 465, // try 2525 instead of 587
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_SMTP_KEY,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            logger: true,
            debug: true,
        });

        console.log("BEFORE SEND");

        const info = await transporter.sendMail({
            from: '"Auctify" <amankumar213564@gmail.com>',
            to: email,
            subject: "OTP Verification",
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Auctify OTP Verification</h2>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing:4px;">${otp}</h1>
                    <p>This OTP will expire in 5 minutes.</p>
                </div>
            `,
        });

        console.log("AFTER SEND");
        console.log("MESSAGE ID:", info.messageId);

        return info;
    } catch (error) {
        console.error("EMAIL ERROR:");
        console.error(error);
        console.error("MESSAGE:", error.message);
        console.error("CODE:", error.code);
        console.error("RESPONSE:", error.response);

        throw error;
    }
};

export { sendEmail };
