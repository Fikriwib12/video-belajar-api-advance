const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.APP_URL}/api/auth/verifikasi-email?token=${token}`;

  await transporter.sendMail({
    from: `"EduCourse App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verifikasi Email Akun EduCourse",
    html: `
      <h2>Selamat datang di EduCourse!</h2>
      <p>Klik tombol di bawah untuk memverifikasi email kamu:</p>
      <a href="${verifyUrl}" style="
        display:inline-block;
        padding:10px 20px;
        background:#4F46E5;
        color:white;
        border-radius:6px;
        text-decoration:none;
      ">Verifikasi Email</a>
      <p>Atau salin link ini ke browser:</p>
      <p>${verifyUrl}</p>
      <p>Link ini tidak akan kadaluarsa hingga kamu memverifikasi akun.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };
