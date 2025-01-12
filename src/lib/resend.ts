import { Resend } from "resend";
import { RESEND_API_KEY } from "../config";


const resend = new Resend(RESEND_API_KEY);


const SendEmailBySMTP = async (email: string, subject: string, otp: string) => {
    const htmlTemplate = `
  Welcome to Hostlio , 
  your otp  is ${otp} only valid for 10 minutes.
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

    return `Email sent to ${email} id:[${data.id}]`
}

export { SendEmailBySMTP }