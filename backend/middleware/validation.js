/**
 * Validation Middleware
 * Express-validator rules for request body validation.
 */

const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors - call after validation rules
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Appointment validation rules
 */
const validateAppointment = [
  body('name')
    .trim()
    .notEmpty().withMessage('Patient name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]?[\d\s-]{7,15}$/).withMessage('Please provide a valid phone number'),
  body('service')
    .trim()
    .notEmpty().withMessage('Service is required'),
  body('date')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Please provide a valid date'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  handleValidationErrors,
];

/**
 * Login validation rules
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

/**
 * Doctor validation rules
 */
const validateDoctor = [
  body('name')
    .trim()
    .notEmpty().withMessage('Doctor name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('qualification')
    .trim()
    .notEmpty().withMessage('Qualification is required')
    .isLength({ max: 200 }).withMessage('Qualification cannot exceed 200 characters'),
  body('specialization')
    .trim()
    .notEmpty().withMessage('Specialization is required'),
  body('experience')
    .notEmpty().withMessage('Experience is required')
    .isInt({ min: 0 }).withMessage('Experience must be a non-negative number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  handleValidationErrors,
];

/**
 * Service validation rules
 */
const validateService = [
  body('title')
    .trim()
    .notEmpty().withMessage('Service title is required')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Service description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters'),
  body('category')
    .optional()
    .isIn(['general', 'cosmetic', 'orthodontics', 'surgery', 'pediatric', 'other'])
    .withMessage('Invalid service category'),
  handleValidationErrors,
];

module.exports = {
  validateAppointment,
  validateLogin,
  validateDoctor,
  validateService,
  handleValidationErrors,
};
