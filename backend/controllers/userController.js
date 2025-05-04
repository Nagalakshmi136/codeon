/**
 * @file Handles updating the authenticated user's profile.
 */

const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * @desc   Update the current user's profile (name, email, optional password)
 * @route  PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  // 1. Fetch user by ID from JWT (attached to req.user)
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 2. Apply incoming changes (if any)
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.password) user.password = req.body.password; // hashed via pre-save hook

  // 3. Save and return updated user (omit password)
  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    status: updated.status,
    // token: generateToken(updated._id), // optional token refresh
  });
});

module.exports = { updateUserProfile };