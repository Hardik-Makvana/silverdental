/**
 * ClinicInfo Model
 * Singleton-style document storing clinic metadata, contact info, stats, and hours.
 */

const mongoose = require('mongoose');

const WorkingHoursSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hours: { type: String, default: 'Closed' },
  isOpen: { type: Boolean, default: false },
}, { _id: false });

const ClinicInfoSchema = new mongoose.Schema({
  clinicName: {
    type: String,
    default: 'Silver Smile Dental',
    trim: true,
  },
  tagline: {
    type: String,
    default: 'Your Smile, Our Priority',
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  whatsapp: {
    type: String,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    default: '',
    trim: true,
  },
  address: {
    street: { type: String, default: '' },
    area: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },
  workingHours: {
    type: [WorkingHoursSchema],
    default: [],
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  stats: {
    patientsServed: { type: Number, default: 0 },
    yearsExperience: { type: Number, default: 0 },
    specialists: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
  },
  aboutText: {
    type: String,
    default: '',
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update the updatedAt timestamp
ClinicInfoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

ClinicInfoSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('ClinicInfo', ClinicInfoSchema);
