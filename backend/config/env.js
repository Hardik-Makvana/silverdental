/**
 * Environment Configuration
 * Loads .env file and exports all environment variables with sensible defaults.
 */

const dotenv = require('dotenv');
const path = require('path');

// Load .env file from the backend root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/silversmile',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'silversmile_jwt_secret_key_2024_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Default Admin
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@silversmiledental.in',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'SilverSmile@2024',

  // Twilio WhatsApp
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM || '',
  ADMIN_WHATSAPP_TO: process.env.ADMIN_WHATSAPP_TO || '',

  // Email (SMTP)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Silver Smile Dental <noreply@silversmiledental.in>',
  ADMIN_EMAIL_TO: process.env.ADMIN_EMAIL_TO || '',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // File Uploads
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
