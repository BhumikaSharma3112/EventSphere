const nodemailer = require('nodemailer');

const isConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter;

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  console.log('✉️ SMTP not configured. Emails will be logged to console in dev mode.');
}

/**
 * Send an email notification.
 * 
 * @param {Object} options - Email options (to, subject, text, html, attachments).
 */
const sendEmail = async (options) => {
  if (isConfigured) {
    try {
      const mailOptions = {
        from: `"EventSphere" <${process.env.SMTP_USER}>`,
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
      console.error('Email Delivery Error:', error);
    }
  }

  // Fallback dev mode console output
  console.log('\n--- DEV MODE EMAIL LOG ---');
  console.log(`To:      ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Body:    ${options.text || 'HTML Content (rendered in email)'}`);
  if (options.attachments && options.attachments.length > 0) {
    console.log(`Attachments: ${options.attachments.map(a => a.filename).join(', ')}`);
  }
  console.log('--------------------------\n');
  return { messageId: 'mock_message_id_' + Date.now() };
};

module.exports = { sendEmail, isConfigured };
