// This file handles student-specific operations such as sign-up.

const User = require('../models/User'); // User model is reused with a 'student' role

// Sign up a new student
exports.signup = async (req, res) => {
  try {
    // Extract required details for student registration from the request body
    const { name, email, password } = req.body;
    // Create a new user with the 'student' role
    const user = new User({ name, email, password, role: 'student' });
    await user.save();
    // Respond with a success message when registration is complete
    res.status(201).json({ message: 'Student registered!' });
  } catch (err) {
    // Handle any errors that occur during sign-up
    res.status(500).json({ message: 'Error occurred' });
  }
};
