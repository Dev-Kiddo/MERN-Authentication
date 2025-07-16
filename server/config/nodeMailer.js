const nodemailer = require("nodemailer");

exports.sendMail = async function (to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      text,
    });

    console.log(`Mail sent: ${to}`);
  } catch (error) {
    console.error("Nodemail error:", error);
  }
};
