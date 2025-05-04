// This file handles user authentication including registration, login, and profile retrieval.

const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // User model for DB operations
const generateToken = require('../utils/generateToken'); // Utility for JWT token creation

// ========================= USER REGISTRATION =========================

// Register a new student
// POST /api/auth/register/student
// Public: Anyone can register as a student (auto-approved)
const registerStudent = asyncHandler(async (req, res) => {
  // Destructure required fields from the request body
  const { name, email, password } = req.body;
  
  // Validate input to ensure all fields are present
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  
  // Check if a student with the same email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Student already exists');
  }
  
  // Create and save the new student; password hashing is done in the model middleware
  const user = await User.create({
    name,
    email,
    password,
    role: 'student',
    status: 'approved', // Auto-approval for students
  });
  
  // Return the student details along with an authentication token
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Register a new teacher (requires admin approval)
// POST /api/auth/register/teacher
// Public: Registration allowed, but teacher must be approved by an admin to log in
const registerTeacher = asyncHandler(async (req, res) => {
  // Extract teacher details from the request body
  const { name, email, password } = req.body;
  
  // Validate that all required fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  
  // Verify the email is not already in use
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Teacher email already registered');
  }
  
  // Create the teacher with a pending status, pending admin approval
  const user = await User.create({
    name,
    email,
    password,
    role: 'teacher',
    status: 'pending',
  });
  
  // Do not provide a token as the teacher is not yet approved
  if (user) {
    res.status(201).json({
      message: 'Teacher registration successful. Waiting for admin approval.',
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ========================= USER LOGIN =========================

// Authenticate and log in a user
// POST /api/auth/login
// Public: Validates credentials and returns a JWT if successful
const loginUser = asyncHandler(async (req, res) => {
  // Extract login credentials from the request body
  const { email, password } = req.body;
  
  // Check that both email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  
  // Find the user corresponding to the email
  const user = await User.findOne({ email });
  // ...existing code... (debug logs may be present)
  
  // Validate the password using the user model's matchPassword method
  if (user && (await user.matchPassword(password))) {
    // For teacher accounts, prevent login if the account is not approved
    if (user.role === 'teacher' && user.status !== 'approved') {
        res.status(403);
        throw new Error(`Teacher account is ${user.status}. Cannot log in.`);
    }
    
    // Return user data along with an authentication token upon successful login
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ========================= USER PROFILE =========================

// Retrieve the profile information for the logged-in user
// GET /api/auth/me
// Private: Requires a valid authentication token
const getMe = asyncHandler(async (req, res) => {
  // The protect middleware attaches the user to req.user if authenticated
  if (req.user) {
      res.json(req.user);
  } else {
      res.status(404);
      throw new Error('User not found');
  }
});

module.exports = {
  registerStudent,
  registerTeacher,
  loginUser,
  getMe,
};