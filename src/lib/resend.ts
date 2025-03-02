import { Resend } from "resend";
import { RESEND_API_KEY } from "../config";

const resend = new Resend(RESEND_API_KEY);

const SendEmailBySMTP = async (email: string, subject: string, otp: string) => {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hostlio OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #0095F6;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .otp {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #0095F6;
            text-align: center;
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            padding: 10px 20px;
            background-color: #f4f4f4;
            color: #888888;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            background-color: #0095F6;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>Welcome to Hostlio!</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <p>Thank you for choosing Hostlio to find your perfect accommodation! To complete your verification, please use the One-Time Password (OTP) provided below.</p>
            <div class="otp">${otp}</div>
            <p><strong>Note:</strong></p>
            <ul>
                <li>This OTP is valid for the next <strong>10 minutes</strong>.</li>
                <li>Do not share this OTP with anyone. Hostlio will never ask you for your OTP.</li>
            </ul>
            <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
            <a href="mailto:support@hostlio.in" class="btn">Contact Support</a>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>Need help? Contact us at <a href="mailto:support@hostlio.in">support@hostlio.in</a> or call us at <strong>[Your Contact Number]</strong>.</p>
            <p>Thank you, <br> The Hostlio Team</p>
            <p><em>Find. Filter. Settle.</em></p>
        </div>
    </div>
</body>
</html>

  `;

  const { data, error } = await resend.emails.send({
    from: "Hostlio <admin@hostlio.in>",
    to: email,
    subject: subject,
    html: htmlTemplate,
  });

  if (error) {
    return `Unable to send email to ${email} due to ${error.message}`;
  }

  return `Email sent to ${email} id:[${data.id}]`;
};

export { SendEmailBySMTP };
