/**
 * Gallery Model
 * Clinic gallery images with categories, before/after pairing support.
 */

const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  category: {
    type: String,
    enum: ['clinic', 'team', 'equipment', 'before-after', 'events'],
    default: 'clinic',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  // For before-after category: marks if this is the "before" image
  isBefore: {
    type: Boolean,
    default: false,
  },
  // For before-after category: links paired before/after images together
  pairId: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model('Gallery', GallerySchema);
