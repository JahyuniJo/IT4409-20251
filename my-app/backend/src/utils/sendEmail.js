import axios from "axios";

const sendEmail = async ({ to, otp }) => {
  const html = `
    <div style="font-family:Arial;padding:20px">
      <h3>DH Story – Đặt lại mật khẩu</h3>
      <p>Mã OTP của bạn:</p>
      <h1 style="letter-spacing:6px">${otp}</h1>
      <p>Mã có hiệu lực trong 5 phút.</p>
    </div>
  `;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: process.env.BREVO_FROM_NAME, email: process.env.BREVO_EMAIL },
      to: [{ email: to }],
      subject: "Mã OTP đặt lại mật khẩu",
      htmlContent: html
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );
};

export default sendEmail;
