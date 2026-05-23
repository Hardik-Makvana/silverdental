/**
 * Appointment Model
 * Stores patient appointment requests and their lifecycle status.
 */

const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[+]?[\d\s-]{7,15}$/, 'Please provide a valid phone number'],
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on every save
AppointmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Also update on findOneAndUpdate
AppointmentSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
