const nodemailer = require('nodemailer');
const { getFallbackMode } = require('../config/db');

const checkSMTPConfigured = () => {
  const isMock = process.env.FORCE_MOCK === 'true';
  const hasEnv = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
  return !isMock && hasEnv;
};

const getTransporter = () => {
  if (!checkSMTPConfigured()) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send an email notification.
 * 
 * @param {Object} options - Email options (to, subject, text, html, attachments).
 */
const sendEmail = async (options) => {
  // Always log OTP or notification in backend console for instant developer access
  console.log('\n=========================================');
  console.log('✉️  EVENTSPHERE EMAIL DISPATCH');
  console.log(`To:      ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  if (options.text) {
    console.log(`Content: ${options.text}`);
  }
  console.log('=========================================\n');

  if (checkSMTPConfigured()) {
    try {
      const transporter = getTransporter();
      const senderEmail = process.env.BREVO_FROM_EMAIL || process.env.SMTP_SENDER || process.env.SMTP_USER;
      const mailOptions = {
        from: `"EventSphere" <${senderEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      };
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Real SMTP Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Email Delivery Error (Real SMTP Failed):', error.message || error);
    }
  } else {
    console.log('💡 [DEV / FALLBACK MODE]: Real SMTP skipped. Use the console log above for OTP verification code.');
  }

  return { messageId: 'mock_message_id_' + Date.now() };
};

module.exports = { sendEmail, isConfigured: checkSMTPConfigured };

