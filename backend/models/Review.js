/**
 * Review Model
 * Patient reviews and ratings for the clinic.
 */

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
  },
  image: {
    type: String,
    default: '',
  },
  service: {
    type: String,
    trim: true,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
