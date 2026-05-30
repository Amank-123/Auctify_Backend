import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
    try {
        console.log("=== EMAIL START ===");

        console.log("HOST:", process.env.BREVO_HOST);
        console.log("PORT:", process.env.BREVO_PORT);
        console.log("USER:", process.env.BREVO_USER);
        console.log("KEY EXISTS:", !!process.env.BREVO_SMTP_KEY);

        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_HOST,
            port: Number(process.env.BREVO_PORT),
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_SMTP_KEY,
            },
            debug: true,
            logger: true,
        });

        console.log("STEP A");

        await transporter.verify();

        console.log("STEP B - VERIFIED");

        const info = await transporter.sendMail({
            from: "amankumar213564@gmail.com",
            to: email,
            subject: "OTP Verification",
            html: `
                <h2>Auctify OTP Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
            `,
        });

        console.log("STEP C - SENT");
        console.log(info);

        return info;
    } catch (error) {
        console.error("EMAIL ERROR:");
        console.error(error);
        console.error(error.message);
        console.error(error.code);
        console.error(error.response);

        throw error;
    }
};

export { sendEmail };
