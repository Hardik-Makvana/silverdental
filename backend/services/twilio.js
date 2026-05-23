/**
 * Twilio WhatsApp Service
 * Sends WhatsApp messages via Twilio API.
 * Fails gracefully if Twilio credentials are not configured.
 */

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
  ADMIN_WHATSAPP_TO,
} = require('../config/env');

// Only initialize Twilio client if credentials are available
let twilioClient = null;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio WhatsApp service initialized');
  } catch (error) {
    console.warn('⚠️  Twilio initialization failed:', error.message);
  }
} else {
  console.warn('⚠️  Twilio credentials not configured. WhatsApp notifications disabled.');
}

/**
 * Send a WhatsApp message via Twilio
 * @param {string} to - Recipient WhatsApp number (e.g., whatsapp:+919429051771)
 * @param {string} body - Message body text
 * @returns {object|null} - Twilio message SID or null on failure
 */
const sendWhatsAppMessage = async (to, body) => {
  // Skip if Twilio is not configured
  if (!twilioClient || !TWILIO_WHATSAPP_FROM) {
    console.log('ℹ️  WhatsApp message skipped (Twilio not configured)');
    return null;
  }

  try {
    const message = await twilioClient.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
      body,
    });

    console.log(`✅ WhatsApp message sent. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`❌ WhatsApp send failed: ${error.message}`);
    return null;
  }
};

/**
 * Notify admin about a new appointment via WhatsApp
 * @param {object} appointment - Appointment document
 */
const notifyAdminNewAppointment = async (appointment) => {
  if (!ADMIN_WHATSAPP_TO) {
    console.log('ℹ️  Admin WhatsApp notification skipped (no admin number configured)');
    return null;
  }

  const message = `🦷 *New Appointment Request*\n\n` +
    `👤 *Name:* ${appointment.name}\n` +
    `📞 *Phone:* ${appointment.phone}\n` +
    `🏥 *Service:* ${appointment.service}\n` +
    `📅 *Date:* ${new Date(appointment.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
    `💬 *Message:* ${appointment.message || 'N/A'}\n\n` +
    `Please log in to the admin panel to manage this appointment.`;

  return await sendWhatsAppMessage(ADMIN_WHATSAPP_TO, message);
};

/**
 * Notify patient about their appointment status change
 * @param {object} appointment - Updated appointment document
 * @param {string} oldStatus - Previous status
 */
const notifyPatientStatusUpdate = async (appointment, oldStatus) => {
  if (!appointment.phone) {
    console.log('ℹ️  Patient status notification skipped (no phone number)');
    return null;
  }

  const statusMessages = {
    confirmed: '✅ Your appointment has been confirmed!',
    completed: '🎉 Your appointment has been marked as completed. Thank you for visiting!',
    cancelled: '❌ Your appointment has been cancelled. Please contact us for rescheduling.',
  };

  const statusMsg = statusMessages[appointment.status] || `Your appointment status has been updated to: ${appointment.status}`;

  const message = `🦷 *Silver Smile Dental*\n\n` +
    `Hi ${appointment.name},\n\n` +
    `${statusMsg}\n\n` +
    `📅 *Date:* ${new Date(appointment.date).toLocaleDateString('en-IN')}\n` +
    `🏥 *Service:* ${appointment.service}\n\n` +
    `For any queries, contact us at +919429051771`;

  return await sendWhatsAppMessage(appointment.phone, message);
};

module.exports = {
  sendWhatsAppMessage,
  notifyAdminNewAppointment,
  notifyPatientStatusUpdate,
};
