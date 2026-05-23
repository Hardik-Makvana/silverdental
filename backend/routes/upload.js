const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/cloudinaryUpload');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/upload
 * @desc    Upload an image to Cloudinary and return the URL
 * @access  Private (Admin only)
 */
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file'
    });
  }

  res.status(200).json({
    success: true,
    url: req.file.path,
    message: 'Image uploaded successfully'
  });
});

module.exports = router;
