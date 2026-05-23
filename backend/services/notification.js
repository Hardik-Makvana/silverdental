/**
 * Notification Orchestrator Service
 * Coordinates sending notifications via multiple channels (WhatsApp + Email).
 * Uses Promise.allSettled so one channel failure doesn't block others.
 */

const { notifyAdminNewAppointment, notifyPatientStatusUpdate } = require('./twilio');
const { sendNewAppointmentEmail, sendStatusUpdateEmail } = require('./email');

/**
 * Send notifications for a new appointment
 * Fires WhatsApp and Email in parallel; logs results but never throws.
 * @param {object} appointment - Newly created appointment document
 */
const sendNewAppointmentNotification = async (appointment) => {
  try {
    console.log(`📤 Sending new appointment notifications for: ${appointment.name}`);

    const results = await Promise.allSettled([
      notifyAdminNewAppointment(appointment),
      sendNewAppointmentEmail(appointment),
    ]);

    // Log results of each notification channel
    const channels = ['WhatsApp', 'Email'];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value) {
          console.log(`  ✅ ${channels[index]} notification sent`);
        } else {
          console.log(`  ℹ️  ${channels[index]} notification skipped (not configured)`);
        }
      } else {
        console.error(`  ❌ ${channels[index]} notification failed:`, result.reason?.message || result.reason);
      }
    });

    return results;
  } catch (error) {
    // This should never throw, but just in case
    console.error('❌ Notification orchestration error:', error.message);
    return null;
  }
};

/**
 * Send notifications for appointment status change
 * Fires WhatsApp (to patient) and Email (to admin) in parallel.
 * @param {object} appointment - Updated appointment document
 * @param {string} oldStatus - Previous status value
 */
const sendStatusUpdateNotification = async (appointment, oldStatus) => {
  try {
    // Don't send notification if status hasn't actually changed
    if (oldStatus === appointment.status) {
      console.log('ℹ️  Status unchanged, skipping notifications');
      return null;
    }

    console.log(`📤 Sending status update notifications: ${oldStatus} → ${appointment.status}`);

    const results = await Promise.allSettled([
      notifyPatientStatusUpdate(appointment, oldStatus),
      sendStatusUpdateEmail(appointment, oldStatus),
    ]);

    // Log results
    const channels = ['WhatsApp (Patient)', 'Email (Admin)'];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value) {
          console.log(`  ✅ ${channels[index]} notification sent`);
        } else {
          console.log(`  ℹ️  ${channels[index]} notification skipped`);
        }
      } else {
        console.error(`  ❌ ${channels[index]} notification failed:`, result.reason?.message || result.reason);
      }
    });

    return results;
  } catch (error) {
    console.error('❌ Status notification orchestration error:', error.message);
    return null;
  }
};

module.exports = {
  sendNewAppointmentNotification,
  sendStatusUpdateNotification,
};
