import SibApiV3Sdk from "sib-api-v3-sdk";

const sendEmail = async (email, otp, purpose = "Verification") => {
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
        subject: `${purpose} OTP`,
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
        </head>
        <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding:40px 20px;">
                        <table width="600" cellpadding="0" cellspacing="0"
                            style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

                            <tr>
                                <td style="background:#1e40af;padding:24px;text-align:center;">
                                    <h1 style="margin:0;color:white;">
                                        Auctify
                                    </h1>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:40px;">
                                    <h2 style="margin-top:0;color:#111827;">
                                        ${purpose}
                                    </h2>

                                    <p style="color:#4b5563;font-size:16px;line-height:1.6;">
                                        Use the OTP below to complete the requested action.
                                    </p>

                                    <div style="text-align:center;margin:32px 0;">
                                        <div style="
                                            display:inline-block;
                                            padding:16px 32px;
                                            background:#f3f4f6;
                                            border:2px dashed #1e40af;
                                            border-radius:10px;
                                            font-size:32px;
                                            font-weight:bold;
                                            letter-spacing:8px;
                                            color:#1e40af;
                                        ">
                                            ${otp}
                                        </div>
                                    </div>

                                    <p style="color:#4b5563;">
                                        This OTP will expire in
                                        <strong>5 minutes</strong>.
                                    </p>

                                    <p style="color:#4b5563;">
                                        If you did not initiate this request,
                                        please ignore this email.
                                    </p>

                                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

                                    <p style="font-size:13px;color:#9ca3af;text-align:center;">
                                        This is an automated email from Auctify.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
    });
};

export { sendEmail };
