/**
 * Service Routes
 * Public listing of active services + protected CRUD for admin management.
 * Same pattern as doctors routes.
 */

const express = require('express');
const router = express.Router();

const Service = require('../models/Service');
const { protect } = require('../middleware/auth');
const { validateService } = require('../middleware/validation');

/**
 * @route   GET /api/services
 * @desc    Get all active services (sorted by order)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check if request comes from an authenticated user (admin sees all)
    const isAdmin = req.headers.authorization || (req.cookies && req.cookies.token);

    let query = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    // Optional category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const services = await Service.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
    });
  }
});

/**
 * @route   GET /api/services/:id
 * @desc    Get single service by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    console.error('Get service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
    });
  }
});

/**
 * @route   POST /api/services
 * @desc    Create a new service
 * @access  Private (admin)
 */
router.post('/', protect, validateService, async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
    });
  }
});

/**
 * @route   PUT /api/services/:id
 * @desc    Update a service
 * @access  Private (admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    console.error('Update service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
    });
  }
});

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service
 * @access  Private (admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    console.error('Delete service error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
    });
  }
});

module.exports = router;
