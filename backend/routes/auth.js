/**
 * Auth Routes
 * Handles admin authentication: login, logout, profile, password reset.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();

const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

/**
 * Helper: Generate JWT token and send as response + cookie
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Create JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  // Remove password from output
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: userData,
    });
};

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user / clear cookie
 * @access  Public
 */
router.post('/logout', (req, res) => {
  res
    .status(200)
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000), // Expire in 5 seconds
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate password reset token
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether user exists
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash and save to user
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // In production, send email with reset link
    // For now, return token (in production, remove this)
    console.log(`Password reset token generated for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
      // Include token in development only
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset',
    });
  }
});

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.put('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Hash the incoming token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid (non-expired) token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
    });
  }
});

module.exports = router;
