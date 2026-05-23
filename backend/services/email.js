/**
 * Email Service
 * Sends emails via Nodemailer (SMTP/Gmail).
 * Fails gracefully if email credentials are not configured.
 */

const nodemailer = require('nodemailer');
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  ADMIN_EMAIL_TO,
} = require('../config/env');

// Only create transporter if credentials are available
let transporter = null;

if (EMAIL_USER && EMAIL_PASS) {
  try {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT, 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
    console.log('✅ Email service initialized');
  } catch (error) {
    console.warn('⚠️  Email transporter creation failed:', error.message);
  }
} else {
  console.warn('⚠️  Email credentials not configured. Email notifications disabled.');
}

/**
 * Send an email
 * @param {object} options - { to, subject, text, html }
 * @returns {object|null} - Nodemailer info or null on failure
 */
const sendEmail = async (options) => {
  if (!transporter) {
    console.log('ℹ️  Email skipped (transporter not configured)');
    return null;
  }

  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text || '',
      html: options.html || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email send failed: ${error.message}`);
    return null;
  }
};

/**
 * Send new appointment notification email to admin
 * @param {object} appointment - Appointment document
 */
const sendNewAppointmentEmail = async (appointment) => {
  if (!ADMIN_EMAIL_TO) {
    console.log('ℹ️  Admin email notification skipped (no admin email configured)');
    return null;
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .field { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .field-label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; margin-bottom: 3px; }
        .field-value { color: #333; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
        .status-badge { display: inline-block; padding: 5px 15px; background: #ffc107; color: #333; border-radius: 20px; font-weight: bold; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦷 New Appointment Request</h1>
          <p style="margin: 5px 0 0;">Silver Smile Dental</p>
        </div>
        <div class="content">
          <p style="margin-top: 0;">A new appointment has been submitted:</p>
          
          <div class="field">
            <div class="field-label">Patient Name</div>
            <div class="field-value">${appointment.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Phone Number</div>
            <div class="field-value">${appointment.phone}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Service Requested</div>
            <div class="field-value">${appointment.service}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Preferred Date</div>
            <div class="field-value">${formattedDate}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Message</div>
            <div class="field-value">${appointment.message || 'No message provided'}</div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <span class="status-badge">⏳ Pending</span>
          </div>
          
          <p style="text-align: center; margin-top: 20px; color: #666;">
            Please log in to the admin panel to manage this appointment.
          </p>
        </div>
        <div class="footer">
          <p>Silver Smile Dental Clinic &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: ADMIN_EMAIL_TO,
    subject: `🦷 New Appointment: ${appointment.name} - ${appointment.service}`,
    text: `New Appointment from ${appointment.name}. Phone: ${appointment.phone}. Service: ${appointment.service}. Date: ${formattedDate}. Message: ${appointment.message || 'N/A'}`,
    html,
  });
};

/**
 * Send appointment status update email to admin
 * @param {object} appointment - Updated appointment document
 * @param {string} oldStatus - Previous status
 */
const sendStatusUpdateEmail = async (appointment, oldStatus) => {
  if (!ADMIN_EMAIL_TO) {
    console.log('ℹ️  Status update email skipped (no admin email configured)');
    return null;
  }

  const statusColors = {
    pending: '#ffc107',
    confirmed: '#28a745',
    completed: '#007bff',
    cancelled: '#dc3545',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { color: #333; }
        .status-change { text-align: center; margin: 20px 0; font-size: 18px; }
        .old-status { color: ${statusColors[oldStatus] || '#666'}; text-decoration: line-through; }
        .new-status { color: ${statusColors[appointment.status] || '#666'}; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🦷 Appointment Status Updated</h2>
        <p><strong>Patient:</strong> ${appointment.name}</p>
        <p><strong>Phone:</strong> ${appointment.phone}</p>
        <p><strong>Service:</strong> ${appointment.service}</p>
        <div class="status-change">
          <span class="old-status">${oldStatus.toUpperCase()}</span>
          &nbsp;→&nbsp;
          <span class="new-status">${appointment.status.toUpperCase()}</span>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: ADMIN_EMAIL_TO,
    subject: `Appointment Update: ${appointment.name} - ${oldStatus} → ${appointment.status}`,
    text: `Appointment for ${appointment.name} changed from ${oldStatus} to ${appointment.status}.`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendNewAppointmentEmail,
  sendStatusUpdateEmail,
};
