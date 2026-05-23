/**
 * FAQ Routes
 * Public listing of active FAQs + protected CRUD for admin management.
 * Same pattern as reviews routes.
 */

const express = require('express');
const router = express.Router();

const FAQ = require('../models/FAQ');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/faqs
 * @desc    Get all active FAQs (sorted by order)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check if request comes from admin
    const isAdmin = req.headers.authorization || (req.cookies && req.cookies.token);

    let query = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    // Optional category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error('Get FAQs error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
    });
  }
});

/**
 * @route   POST /api/faqs
 * @desc    Create a new FAQ
 * @access  Private (admin)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;

    // Validate required fields
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required',
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'general',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    console.error('Create FAQ error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
    });
  }
});

/**
 * @route   PUT /api/faqs/:id
 * @desc    Update a FAQ
 * @access  Private (admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }
    console.error('Update FAQ error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
    });
  }
});

/**
 * @route   DELETE /api/faqs/:id
 * @desc    Delete a FAQ
 * @access  Private (admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }
    console.error('Delete FAQ error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
    });
  }
});

module.exports = router;
