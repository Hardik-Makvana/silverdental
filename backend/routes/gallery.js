/**
 * Gallery Routes
 * Image gallery with multer upload support.
 * Public listing + protected CRUD for admin management.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const { MAX_FILE_SIZE, UPLOAD_DIR } = require('../config/env');

// Ensure upload directory exists
const uploadPath = path.join(__dirname, '..', UPLOAD_DIR, 'gallery');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: gallery-timestamp-random.ext
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `gallery-${uniqueSuffix}${ext}`);
  },
});

// File filter: only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed'), false);
  }
};

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

/**
 * @route   GET /api/gallery
 * @desc    Get all active gallery images
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.headers.authorization || (req.cookies && req.cookies.token);

    let query = {};
    if (!isAdmin) {
      query.isActive = true;
    }

    // Optional category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error('Get gallery error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
    });
  }
});

/**
 * @route   POST /api/gallery
 * @desc    Upload a new gallery image
 * @access  Private (admin)
 */
router.post('/', protect, (req, res) => {
  // Use multer upload middleware with error handling
  upload.single('image')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image file',
        });
      }

      // Build image path (relative to uploads directory)
      const imagePath = `/uploads/gallery/${req.file.filename}`;

      const galleryItem = await Gallery.create({
        title: req.body.title || '',
        image: imagePath,
        category: req.body.category || 'clinic',
        description: req.body.description || '',
        isBefore: req.body.isBefore === 'true' || req.body.isBefore === true,
        pairId: req.body.pairId || '',
        order: parseInt(req.body.order, 10) || 0,
        isActive: req.body.isActive !== 'false',
      });

      res.status(201).json({
        success: true,
        message: 'Gallery image uploaded successfully',
        data: galleryItem,
      });
    } catch (error) {
      console.error('Create gallery error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to upload gallery image',
      });
    }
  });
});

/**
 * @route   PUT /api/gallery/:id
 * @desc    Update a gallery item (with optional new image)
 * @access  Private (admin)
 */
router.put('/:id', protect, (req, res) => {
  upload.single('image')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      const galleryItem = await Gallery.findById(req.params.id);

      if (!galleryItem) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found',
        });
      }

      // Update fields
      if (req.body.title !== undefined) galleryItem.title = req.body.title;
      if (req.body.category) galleryItem.category = req.body.category;
      if (req.body.description !== undefined) galleryItem.description = req.body.description;
      if (req.body.isBefore !== undefined) galleryItem.isBefore = req.body.isBefore === 'true' || req.body.isBefore === true;
      if (req.body.pairId !== undefined) galleryItem.pairId = req.body.pairId;
      if (req.body.order !== undefined) galleryItem.order = parseInt(req.body.order, 10) || 0;
      if (req.body.isActive !== undefined) galleryItem.isActive = req.body.isActive !== 'false';

      // If new image uploaded, update path and try to delete old file
      if (req.file) {
        // Delete old image file if it exists
        const oldImagePath = path.join(__dirname, '..', galleryItem.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (unlinkErr) {
            console.warn('Could not delete old image:', unlinkErr.message);
          }
        }
        galleryItem.image = `/uploads/gallery/${req.file.filename}`;
      }

      await galleryItem.save();

      res.status(200).json({
        success: true,
        message: 'Gallery item updated successfully',
        data: galleryItem,
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found',
        });
      }
      console.error('Update gallery error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update gallery item',
      });
    }
  });
});

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Delete a gallery item and its image file
 * @access  Private (admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    // Try to delete the image file
    const imagePath = path.join(__dirname, '..', galleryItem.image);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (unlinkErr) {
        console.warn('Could not delete image file:', unlinkErr.message);
      }
    }

    await galleryItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }
    console.error('Delete gallery error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
    });
  }
});

module.exports = router;
