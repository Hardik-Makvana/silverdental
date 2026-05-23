/**
 * Doctor Model
 * Stores doctor profiles with qualifications, social links, and display ordering.
 */

const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true,
    maxlength: [200, 'Qualification cannot exceed 200 characters'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, 'Experience (in years) is required'],
    min: [0, 'Experience cannot be negative'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
