// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Adjust path if necessary
const dotenv = require('dotenv');

dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (remove 'Bearer ' prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token payload (id) and attach to request
      // Exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         res.status(401);
         throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// --- Role-Based Access Middleware ---

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
};

const isTeacher = (req, res, next) => {
  // Check if user is authenticated and is a teacher
  // IMPORTANT: Also check if their status is 'approved' for actions requiring it
  // We might apply this check more specifically in controllers/routes where needed,
  // but having the basic role check here is useful.
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as a teacher');
  }
};

// Optional: Middleware to check if teacher is approved (use after protect & isTeacher)
const isApprovedTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher' && req.user.status === 'approved') {
        next();
    } else {
        res.status(403);
        throw new Error('Teacher account not approved');
    }
}

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as a student');
  }
};


module.exports = { protect, isAdmin, isTeacher, isApprovedTeacher, isStudent };