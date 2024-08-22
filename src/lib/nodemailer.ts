import nodemailer from "nodemailer";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "kumarsravesh39@gmail.com", // Your Gmail email address
    pass: "frkbwqlnteylvqjj", // Your Gmail password
  },

});

// Function to send an email with OTP
const sendEmail = async (
  to: string,
  subject: string,
  otp: string
): Promise<boolean> => {
  // HTML email template with OTP
  const htmlTemplate = `
  Welcome to Renting app owner , 
  your otp  is ${otp} only valid for 10 minutes.
  `;

  // Define email options
  const mailOptions = {
    from: "kumarsravesh39@gmail.com",
    to: to,
    subject: subject,
    html: htmlTemplate,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true; // Email sent successfully
  } catch (error) {
    console.log("Error sending email:", error);
    return false; // Failed to send email
  }
};

export { sendEmail };
