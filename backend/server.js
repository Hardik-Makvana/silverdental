/**
 * Silver Smile Dental - Express Server
 * Main entry point for the backend API.
 *
 * Features:
 * - Helmet for security headers
 * - CORS with configurable origin
 * - Morgan HTTP request logger
 * - Rate limiting
 * - Cookie parser for JWT cookies
 * - Static file serving for uploads
 * - Graceful shutdown handlers
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment configuration (must be first)
const { PORT, NODE_ENV, FRONTEND_URL, UPLOAD_DIR } = require('./config/env');

// Database connection
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const doctorRoutes = require('./routes/doctors');
const serviceRoutes = require('./routes/services');
const reviewRoutes = require('./routes/reviews');
const faqRoutes = require('./routes/faqs');
const galleryRoutes = require('./routes/gallery');
const clinicRoutes = require('./routes/clinic');
const uploadRoutes = require('./routes/upload');

// ==========================================
// Initialize Express App
// ==========================================
const app = express();
app.set('trust proxy', 1); // Trust first proxy (needed for secure cookies on Render/Heroku)

// ==========================================
// Security Middleware
// ==========================================

// Helmet - set various HTTP security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin image loading
}));

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'development' ? true : FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ==========================================
// Rate Limiting
// ==========================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Increased limit to prevent issues during rapid frontend development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api', limiter);

// ==========================================
// Body Parsing & Utility Middleware
// ==========================================

// HTTP request logger (dev format for development)
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// Parse JSON request bodies (limit to 10mb for image data)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser());

// ==========================================
// Static Files
// ==========================================

// Ensure uploads directory exists
const uploadsPath = path.join(__dirname, UPLOAD_DIR);
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsPath));

// ==========================================
// API Routes
// ==========================================

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/upload', uploadRoutes);

// ==========================================
// Health Check
// ==========================================

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Silver Smile Dental API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
  });
});

// ==========================================
// 404 Handler
// ==========================================

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// Global Error Handler
// ==========================================

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large',
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==========================================
// Start Server
// ==========================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Auto-seed admin user if database is empty
    const User = require('./models/User');
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('./config/env');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚠️ No users found in database. Seeding default admin user...');
      await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'superadmin'
      });
      console.log(`✅ Default admin created: ${ADMIN_EMAIL}`);
    }

    // Start listening
    const server = app.listen(PORT, () => {
      console.log('==========================================');
      console.log(`🦷 Silver Smile Dental API Server`);
      console.log(`🚀 Running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📁 Uploads dir: ${uploadsPath}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      console.log('==========================================');
    });

    // ==========================================
    // Graceful Shutdown
    // ==========================================

    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log('🛑 HTTP server closed');

        // Close MongoDB connection
        const mongoose = require('mongoose');
        mongoose.connection.close(false, () => {
          console.log('🛑 MongoDB connection closed');
          process.exit(0);
        });

        // Force exit after 10 seconds if graceful shutdown fails
        setTimeout(() => {
          console.error('⚠️  Forced shutdown after timeout');
          process.exit(1);
        }, 10000);
      });
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err.message);
      // Close server and exit
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err.message);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
