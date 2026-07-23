const nodemailer = require("nodemailer");

// Create Nodemailer Transporter (Uses Gmail SMTP if configured, else test account fallback)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER || "noreply.smartshop.ai@gmail.com",
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "dummy-pass"
  }
});

// Generic Send Mail Function
async function sendHtmlEmail(to, subject, htmlContent) {
  try {
    if (!process.env.SMTP_USER && !process.env.GMAIL_USER) {
      console.log(`[Email Service - Simulated] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }

    const mailOptions = {
      from: `"SmartShop AI" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[Email Service Warning] Could not send live email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// 1. Welcome / Registration Email
async function sendWelcomeEmail(userEmail, userName) {
  const subject = "🎉 Welcome to SmartShop AI!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 24px;">
      <h2 style="color: #6366f1; text-align: center;">SmartShop AI</h2>
      <hr style="border-color: #334155; margin: 20px 0;" />
      <h3>Welcome, ${userName || "Shopper"}!</h3>
      <p style="color: #cbd5e1; line-height: 1.6;">
        Thank you for joining SmartShop AI! Your account <strong>${userEmail}</strong> is now registered.
      </p>
      <div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0;">
        <p style="margin: 0; color: #94a3b8;">✨ What you get with SmartShop AI:</p>
        <ul style="color: #e2e8f0; margin-top: 8px;">
          <li>Real-time personalized AI recommendations</li>
          <li>Instant order tracking & push notifications</li>
          <li>Exclusive deals & 20% discount coupon: <strong>SMARTSHOP20</strong></li>
        </ul>
      </div>
      <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px;">
        © 2026 SmartShop AI Inc. All rights reserved.
      </p>
    </div>
  `;
  return sendHtmlEmail(userEmail, subject, html);
}

// 2. OTP Verification Email
async function sendOtpEmail(userEmail, otpCode) {
  const subject = `🔑 Your SmartShop AI Verification OTP: ${otpCode}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 24px;">
      <h2 style="color: #6366f1; text-align: center;">SmartShop AI Security</h2>
      <hr style="border-color: #334155; margin: 20px 0;" />
      <p style="color: #cbd5e1;">Use the verification code below to complete your login or registration:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; background: #1e293b; padding: 12px 28px; border-radius: 8px; border: 1px solid #0284c7;">
          ${otpCode}
        </span>
      </div>
      <p style="color: #94a3b8; font-size: 13px;">This OTP will expire in 10 minutes. Do not share this code with anyone.</p>
    </div>
  `;
  return sendHtmlEmail(userEmail, subject, html);
}

// 3. Order Confirmation & Itemized Invoice Email
async function sendOrderConfirmationEmail(userEmail, order) {
  const subject = `🛍️ Order Confirmed #${order.order_id || order.id} - SmartShop AI`;
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #334155; color: #f8fafc;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; text-align: center; color: #94a3b8;">x${item.quantity || 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #334155; text-align: right; color: #38bdf8;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
    </tr>
  `).join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 24px;">
      <h2 style="color: #6366f1; text-align: center;">SmartShop AI Invoice</h2>
      <hr style="border-color: #334155; margin: 20px 0;" />
      <h3 style="color: #22c55e;">🎉 Order Placed Successfully!</h3>
      <p style="color: #cbd5e1;">Order ID: <strong>#${order.order_id || order.id}</strong></p>
      <p style="color: #cbd5e1;">Tracking Number: <strong style="color: #38bdf8;">${order.tracking_number || "TRK-EXP-992"}</strong></p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #1e293b; color: #94a3b8;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 15px;">
        <p style="font-size: 18px; font-weight: bold; color: #22c55e;">Total Paid: ₹${(order.total_amount || 0).toLocaleString('en-IN')}</p>
      </div>
    </div>
  `;
  return sendHtmlEmail(userEmail, subject, html);
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  sendOrderConfirmationEmail
};
