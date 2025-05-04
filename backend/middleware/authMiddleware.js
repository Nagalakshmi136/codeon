/**
 * @file Authentication & role-based authorization middleware
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
require('dotenv').config();

/**
 * Verify JWT and attach user to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error('Token verification failed');
  }

  const user = await User.findById(payload.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  req.user = user;
  next();
});

/** Allow only admin users */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required');
  }
  next();
};

/** Allow only teacher users */
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    res.status(403);
    throw new Error('Teacher access required');
  }
  next();
};

/** Ensure teacher account is approved */
const isApprovedTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher' || req.user.status !== 'approved') {
    res.status(403);
    throw new Error('Teacher not approved');
  }
  next();
};

/** Allow only student users */
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Student access required');
  }
  next();
};

module.exports = { protect, isAdmin, isTeacher, isApprovedTeacher, isStudent };