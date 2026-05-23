/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens from headers or cookies.
 * Also provides role-based authorization.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');

/**
 * Protect routes - verify JWT and attach user to request
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Fallback to cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user and attach to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Invalid token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Token has expired.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'superadmin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
