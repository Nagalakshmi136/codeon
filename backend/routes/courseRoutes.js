const express = require('express');
const router = express.Router();
const {
    // Teacher actions
    createCourse,
    getMyCourses,
    // Student/General actions
    getApprovedCourses,
    getCourseById,
    joinCourse,
    getApprovedCourseReviews, 
} = require('../controllers/courseController'); 

// Import review controller for the nested POST route
const { createReview } = require('../controllers/reviewController'); 

const { protect, isTeacher, isApprovedTeacher, isStudent } = require('../middleware/authMiddleware'); 

// --- Course Routes ---

// GET all approved courses (public for logged-in users)
router.get('/', protect, getApprovedCourses); 
// POST create new course (Teacher only)
router.post('/', protect, isTeacher, isApprovedTeacher, createCourse);

// GET teacher's own courses (Teacher only)
router.get('/my', protect, isTeacher, getMyCourses);

// GET single course details (public for logged-in users, only if approved)
router.get('/:id', protect, getCourseById);

// PUT student joins a course (Student only)
router.put('/:id/join', protect, isStudent, joinCourse);


// --- Nested Review Routes (under courses) ---

// POST create a review for a specific course (Student only)
router.post('/:courseId/reviews', protect, isStudent, createReview);

// GET approved reviews for a specific course (public for logged-in users)
router.get('/:courseId/reviews', protect, getApprovedCourseReviews); // Using same path but GET method


module.exports = router;