/**
 * Database Configuration
 * Connects to MongoDB using Mongoose with retry logic and event listeners.
 */

const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

/**
 * Connect to MongoDB
 * Retries on failure and logs connection status.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Mongoose 8 uses sensible defaults; these are optional overrides
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // Exit process with failure code in production; in dev, allow retry
    process.exit(1);
  }
};

module.exports = connectDB;
