import {
    MailerSend,
    EmailParams,
    Sender,
    Recipient
} from "mailersend";
import { MAILERSEN_API_KEY } from "../config";


const mailerSend = new MailerSend({
    apiKey: MAILERSEN_API_KEY,
});


const sentFrom = new Sender("admin@trial-v69oxl535qxg785k.mlsender.net", "Sravesh Nandan");

const SendEmailBYSMTP = async (reciver: string, subject: string, otp: string) => {
    const recipients = [
        new Recipient(reciver, reciver.split("@")[0])
    ];
    const htmlContent = `
  <p>Hey there!</p>
  <p>Welcome to Renting APP , we're happy to have you here!</p>
  <p>You'll be happy to know that your free trial awaits, all you need to do is head to your account,verify your account and start listing your properties.</p>
  <p>Remember to check out our guides and contact support if you need anything.</p>
  <p>Your OTP is ${otp}</p>
  <br>
  <p>Regards,</p>
  <p>The Renting App Team</p>
`;



    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject(subject)
        .setHtml(htmlContent);
    try {
        const emailsentRes = await mailerSend.email.send(emailParams);


        console.log("email sent successfully.")
    } catch (error) {
        console.log("err while sending email", error)
    }

}


export { SendEmailBYSMTP }

