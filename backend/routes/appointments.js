/**
 * Appointment Routes
 * Public booking + protected admin management with analytics.
 * IMPORTANT: /analytics/summary MUST be defined BEFORE /:id to avoid route conflicts.
 */

const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');
const { sendNewAppointmentNotification, sendStatusUpdateNotification } = require('../services/notification');

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment (public)
 * @access  Public
 */
router.post('/', validateAppointment, async (req, res) => {
  try {
    const { name, phone, service, date, message } = req.body;

    const appointment = await Appointment.create({
      name,
      phone,
      service,
      date,
      message: message || '',
    });

    // Send notifications in background (don't await to avoid blocking response)
    sendNewAppointmentNotification(appointment).catch((err) => {
      console.error('Background notification error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will contact you shortly.',
      data: appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment. Please try again.',
    });
  }
});

/**
 * @route   GET /api/appointments/analytics/summary
 * @desc    Get appointment analytics summary
 * @access  Private (admin)
 * NOTE: This route MUST be before /:id to prevent "analytics" being parsed as an ID
 */
router.get('/analytics/summary', protect, async (req, res) => {
  try {
    // Get date range (default: current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Run all aggregation queries in parallel
    const [
      totalCount,
      statusCounts,
      monthlyCount,
      todayCount,
      recentAppointments,
    ] = await Promise.all([
      // Total appointments
      Appointment.countDocuments(),

      // Count by status
      Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // This month's appointments
      Appointment.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),

      // Today's appointments
      Appointment.countDocuments({
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        },
      }),

      // 5 most recent appointments
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name phone service date status createdAt'),
    ]);

    // Transform status counts into an object
    const statusSummary = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    statusCounts.forEach((item) => {
      if (statusSummary.hasOwnProperty(item._id)) {
        statusSummary[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalCount,
        thisMonth: monthlyCount,
        today: todayCount,
        byStatus: statusSummary,
        recent: recentAppointments,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
});

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments with filters and pagination
 * @access  Private (admin)
 */
router.get('/', protect, async (req, res) => {
  try {
    const {
      status,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build filter object
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    // Search by name or phone
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { service: { $regex: search, $options: 'i' } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Appointment.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
    });
  }
});

/**
 * @route   GET /api/appointments/:id
 * @desc    Get single appointment by ID
 * @access  Private (admin)
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    console.error('Get appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
    });
  }
});

/**
 * @route   PATCH /api/appointments/:id
 * @desc    Update appointment (mainly status/notes)
 * @access  Private (admin)
 */
router.patch('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    const oldStatus = appointment.status;

    // Update allowed fields
    const allowedFields = ['status', 'notes', 'date', 'service', 'name', 'phone'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        appointment[field] = req.body[field];
      }
    });

    await appointment.save();

    // Send status change notifications if status changed
    if (oldStatus !== appointment.status) {
      sendStatusUpdateNotification(appointment, oldStatus).catch((err) => {
        console.error('Background status notification error:', err.message);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    console.error('Update appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
    });
  }
});

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete an appointment
 * @access  Private (admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }
    console.error('Delete appointment error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
    });
  }
});

module.exports = router;
