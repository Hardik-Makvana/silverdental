/**
 * Doctor Routes
 * Public listing of active doctors + protected CRUD for admin management.
 */

const express = require('express');
const router = express.Router();

const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');
const { validateDoctor } = require('../middleware/validation');

/**
 * @route   GET /api/doctors
 * @desc    Get all active doctors (sorted by order field)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // For public requests, only return active doctors sorted by order
    const isAdmin = req.headers.authorization || (req.cookies && req.cookies.token);

    let query = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    const doctors = await Doctor.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error('Get doctors error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
    });
  }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    console.error('Get doctor error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
    });
  }
});

/**
 * @route   POST /api/doctors
 * @desc    Create a new doctor profile
 * @access  Private (admin)
 */
router.post('/', protect, validateDoctor, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('Create doctor error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor profile',
    });
  }
});

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update a doctor profile
 * @access  Private (admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    console.error('Update doctor error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile',
    });
  }
});

/**
 * @route   DELETE /api/doctors/:id
 * @desc    Delete a doctor profile
 * @access  Private (admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Doctor profile deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    console.error('Delete doctor error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete doctor profile',
    });
  }
});

module.exports = router;
