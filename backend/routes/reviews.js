/**
 * Review Routes
 * Public listing of active reviews + protected CRUD for admin management.
 */

const express = require('express');
const router = express.Router();

const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/reviews
 * @desc    Get all active reviews
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check if request comes from admin (to show all including inactive)
    const isAdmin = req.headers.authorization || (req.cookies && req.cookies.token);

    let query = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
    });
  }
});

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private (admin)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { patientName, rating, review, image, service, isActive } = req.body;

    // Validate required fields
    if (!patientName || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, rating, and review text are required',
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const newReview = await Review.create({
      patientName,
      rating,
      review,
      image: image || '',
      service: service || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview,
    });
  } catch (error) {
    console.error('Create review error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
    });
  }
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private (admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    console.error('Update review error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
    });
  }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    console.error('Delete review error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
});

module.exports = router;
