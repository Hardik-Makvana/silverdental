/**
 * Clinic Info Routes
 * Public GET for clinic metadata + protected PUT for admin updates.
 * Uses a singleton pattern (one document in the collection).
 */

const express = require('express');
const router = express.Router();

const ClinicInfo = require('../models/ClinicInfo');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/clinic
 * @desc    Get clinic information
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Get the single clinic info document (or create default if none exists)
    let clinicInfo = await ClinicInfo.findOne();

    if (!clinicInfo) {
      // Create default clinic info if not found
      clinicInfo = await ClinicInfo.create({
        clinicName: 'Silver Smile Dental',
        tagline: 'Your Smile, Our Priority',
      });
    }

    res.status(200).json({
      success: true,
      data: clinicInfo,
    });
  } catch (error) {
    console.error('Get clinic info error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clinic information',
    });
  }
});

/**
 * @route   PUT /api/clinic
 * @desc    Update clinic information
 * @access  Private (admin)
 */
router.put('/', protect, async (req, res) => {
  try {
    // Find existing or create new
    let clinicInfo = await ClinicInfo.findOne();

    if (!clinicInfo) {
      // If no document exists, create one with the provided data
      clinicInfo = await ClinicInfo.create(req.body);
    } else {
      // Update existing document
      const updateFields = [
        'clinicName', 'tagline', 'phone', 'whatsapp', 'email',
        'address', 'workingHours', 'socialLinks', 'stats', 'aboutText',
      ];

      updateFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          clinicInfo[field] = req.body[field];
        }
      });

      await clinicInfo.save();
    }

    res.status(200).json({
      success: true,
      message: 'Clinic information updated successfully',
      data: clinicInfo,
    });
  } catch (error) {
    console.error('Update clinic info error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update clinic information',
    });
  }
});

module.exports = router;
