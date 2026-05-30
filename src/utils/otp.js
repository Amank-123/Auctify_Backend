import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async (email, otp) => {
    const client = SibApiV3Sdk.ApiClient.instance;

    client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
        sender: {
            email: "amankumar213564@gmail.com",
            name: "Auctify",
        },
        to: [
            {
                email,
            },
        ],
        subject: "OTP Verification",
        htmlContent: `
            <h2>Auctify OTP Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Expires in 5 minutes.</p>
        `,
    });
};

export { sendEmail };
