// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getMyReviews } = require('../controllers/reviewController'); // Adjust path
const { protect, isStudent } = require('../middleware/authMiddleware'); // Adjust path

// GET reviews submitted by the logged-in student (Student only)
router.get('/my', protect, isStudent, getMyReviews);

module.exports = router;