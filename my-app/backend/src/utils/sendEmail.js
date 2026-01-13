import nodemailer from "nodemailer";
<<<<<<< HEAD

/**
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true nếu dùng 465
=======
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
>>>>>>> ea4ed2a9326ecfed096a4b2ccc21f169d17da622
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

<<<<<<< HEAD
    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
=======
    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
>>>>>>> ea4ed2a9326ecfed096a4b2ccc21f169d17da622
};

export default sendEmail;
