// C:\xsportsmatch-api\api\send-login-code.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: "Missing email or code" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const html = `
    <div style="font-family:system-ui,Arial; font-size:16px">
      <p>Your XSportsMatch login code:</p>
      <p style="font-size:28px; font-weight:700; letter-spacing:3px">${code}</p>
      <p>This code expires in 5 minutes.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"XSportsMatch" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your XSportsMatch login code",
      html,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: "Email failed", details: err.message });
  }
}
