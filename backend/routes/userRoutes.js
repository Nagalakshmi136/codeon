const express = require('express');
const router = express.Router();
const { updateUserProfile } = require('../controllers/userController'); // Adjust path
const { protect } = require('../middleware/authMiddleware'); // Adjust path

// All routes here are protected as they relate to logged-in user actions
router.put('/profile', protect, updateUserProfile);

module.exports = router;
