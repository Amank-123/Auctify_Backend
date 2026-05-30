import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
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

        if (error) {
            console.error("Resend Error:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
};

export { sendEmail };
