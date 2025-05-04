// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStats,
    getPendingTeachers,
    approveTeacher,
    rejectTeacher,
    getPendingCourses,
    approveCourse,
    rejectCourse,
    getPendingReviews,
    approveReview,
    rejectReview,
} = require('../controllers/adminController'); // Adjust path

const { protect, isAdmin } = require('../middleware/authMiddleware'); // Adjust path

// Apply protect and isAdmin middleware to ALL routes in this file
router.use(protect);
router.use(isAdmin);

// --- Admin Routes ---

// Dashboard Stats
router.get('/stats', getStats);

// Teacher Management
router.get('/teachers/pending', getPendingTeachers);
router.put('/teachers/:id/approve', approveTeacher);
router.put('/teachers/:id/reject', rejectTeacher);

// Course Management
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:id/approve', approveCourse);
router.put('/courses/:id/reject', rejectCourse);

// Review Management
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/reject', rejectReview);


module.exports = router;