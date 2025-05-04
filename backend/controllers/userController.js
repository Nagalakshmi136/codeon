// This file handles user profile operations (e.g. updating profile details).

const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Model representing users

// @desc    Update user profile (name, email)
// @route   PUT /api/users/profile
// @access  Private - user must be logged in
const updateUserProfile = asyncHandler(async (req, res) => {
  // Retrieve the current user from the token
  const user = await User.findById(req.user.id);

  if (user) {
    // Update fields if provided, otherwise preserve existing values
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Optionally, update password (hashed by Mongoose pre-save hook)
    if (req.body.password) {
      user.password = req.body.password; // Note: additional password validations can be added here
    }

    // Save the updated user document
    const updatedUser = await user.save();

    // Return updated user details; token regeneration is optional
    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      // token: generateToken(updatedUser._id), // Uncomment if token refresh is desired
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  updateUserProfile,
};