/**
 * Service Model
 * Dental services offered by the clinic, categorized and orderable.
 */

const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters'],
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['general', 'cosmetic', 'orthodontics', 'surgery', 'pediatric', 'other'],
    default: 'general',
  },
  icon: {
    type: String,
    default: '',
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

module.exports = mongoose.model('Service', ServiceSchema);
