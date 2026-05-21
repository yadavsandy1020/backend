require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('../routes/auth');
const schoolRoutes = require('../routes/school');
const userRoutes = require('../routes/user');
const studentRoutes = require('../routes/student');
const teacherRoutes = require('../routes/teacher');
const attendanceRoutes = require('../routes/attendance');
const feeRoutes = require('../routes/fee');
const classRoutes = require('../routes/class');
const noticeRoutes = require('../routes/notice');
const reportRoutes = require('../routes/report');
const customizationRoutes = require('../routes/customization');
const admissionRoutes = require('../routes/admission');
const timetableRoutes = require('../routes/timetable');

// Import middleware
const errorHandler = require('../middleware/errorHandler');
const tenantMiddleware = require('../middleware/tenant');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection with caching for serverless
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.name} - ${error.message}`);
    console.error(`Error Code: ${error.code}`);
    console.error(`Full Error:`, error);
    throw error;
  }
};

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/customization', customizationRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/timetable', timetableRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'School Management API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Export for Vercel serverless
module.exports = app;
