import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, SMTP, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password (not your email password)
  },
});

class EmailService {
  static async sendEmail(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully");
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }
  }
}

export default EmailService;
