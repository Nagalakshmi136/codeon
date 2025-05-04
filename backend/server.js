const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Local Imports ---
const connectDB = require('./config/dbConnect');
const { errorHandler } = require('./middleware/errorMiddleware');

// --- Import Route Files ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');   
const courseRoutes = require('./routes/courseRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes'); 

// --- Load Environment Variables ---
dotenv.config();

// --- Connect to Database ---
connectDB();

// --- Initialize Express App ---
const app = express();

// --- Core Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors());

// Enable Express to parse JSON request bodies
app.use(express.json());

// --- Basic Test/API Status Route ---
app.get('/api', (req, res) => {
  res.json({ message: 'LMS API is running...' });
});

// --- Mount API Routes ---
// Mount authentication routes (login, register, me)
app.use('/api/auth', authRoutes);
// Mount user-specific routes (profile update)
app.use('/api/users', userRoutes);
// Mount admin-specific routes (approvals, stats)
app.use('/api/admin', adminRoutes);
// Mount course-related routes (CRUD, join, teacher's courses, nested reviews)
app.use('/api/courses', courseRoutes);
// Mount review-specific routes (student's own reviews)
app.use('/api/reviews', reviewRoutes);


// --- Custom Error Handler Middleware (Must be LAST middleware) ---
app.use(errorHandler);


// --- Define Port ---
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// --- Start Server ---
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// --- Handle Unhandled Promise Rejections ---
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process gracefully
  server.close(() => {
      console.log('Server closed due to unhandled promise rejection.');
      process.exit(1);
  });
});

// --- Handle SIGTERM for graceful shutdown ---
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        // Add cleanup like closing DB connection if necessary here
        process.exit(0);
    });
});