const nodemailer = require('nodemailer');
const { getFallbackMode } = require('../config/db');

// Only configure SMTP if we are NOT running in mock/fallback mode
const isConfigured = !getFallbackMode() && !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  console.log('✉️ SMTP not configured or running in Mock Mode. Emails will be logged to console.');
}

/**
 * Send an email notification.
 * 
 * @param {Object} options - Email options (to, subject, text, html, attachments).
 */
const sendEmail = async (options) => {
  if (isConfigured) {
    try {
      // Use verified SMTP_SENDER if provided, otherwise default to SMTP_USER login
      const senderEmail = process.env.SMTP_SENDER || process.env.SMTP_USER;
      const mailOptions = {
        from: `"EventSphere" <${senderEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      };
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Email Delivery Error (Real SMTP Failed):', error);
      // Fallback to print in console so operation doesn't get silently lost
    }
  }

  // Fallback dev mode console output
  console.log('\n--- DEV MODE EMAIL LOG (OTP / TICKET) ---');
  console.log(`To:      ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Body:    ${options.text || 'HTML Content (rendered in email)'}`);
  if (options.attachments && options.attachments.length > 0) {
    console.log(`Attachments: ${options.attachments.map(a => a.filename).join(', ')}`);
  }
  console.log('-----------------------------------------\n');
  return { messageId: 'mock_message_id_' + Date.now() };
};

module.exports = { sendEmail, isConfigured };
