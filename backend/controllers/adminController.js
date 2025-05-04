// This file handles administrative tasks including retrieving statistics,
// approving or rejecting teachers, courses, and reviews.

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Review = require('../models/Review');

// ========================= STATISTICS =========================
// Returns counts of approved students and teachers for dashboard stats
const getStats = asyncHandler(async (req, res) => {
    // Count only approved students and teachers for accuracy
    const studentCount = await User.countDocuments({ role: 'student', status: 'approved' });
    const teacherCount = await User.countDocuments({ role: 'teacher', status: 'approved' });

    res.json({
        totalStudents: studentCount,
        totalTeachers: teacherCount,
    });
});

// ======================= TEACHER APPROVAL =======================

// Retrieve a list of teachers pending approval
const getPendingTeachers = asyncHandler(async (req, res) => {
    // Fetch teachers with status 'pending'
    const pendingTeachers = await User.find({ role: 'teacher', status: 'pending' })
        .select('name email createdAt');
    res.json(pendingTeachers);
});

// Approve a pending teacher registration
// PUT /api/admin/teachers/:id/approve
const approveTeacher = asyncHandler(async (req, res) => {
    // Find teacher by provided ID
    const teacher = await User.findById(req.params.id);

    // If valid and pending, update status
    if (teacher && teacher.role === 'teacher' && teacher.status === 'pending') {
        teacher.status = 'approved';
        const updatedTeacher = await teacher.save();
        res.json({
            _id: updatedTeacher._id,
            name: updatedTeacher.name,
            email: updatedTeacher.email,
            status: updatedTeacher.status,
            message: 'Teacher approved successfully.'
        });
    } else if (teacher && teacher.status !== 'pending') {
        res.status(400);
        throw new Error('Teacher is not pending approval');
    } else {
        res.status(404);
        throw new Error('Teacher not found or is not a pending teacher');
    }
});

// Reject a pending teacher registration
// PUT /api/admin/teachers/:id/reject
const rejectTeacher = asyncHandler(async (req, res) => {
    // Find teacher by provided ID
    const teacher = await User.findById(req.params.id);

    // Validate that teacher exists and is pending before rejecting
    if (teacher && teacher.role === 'teacher' && teacher.status === 'pending') {
        teacher.status = 'rejected';
        const updatedTeacher = await teacher.save();
        res.json({
            _id: updatedTeacher._id,
            name: updatedTeacher.name,
            email: updatedTeacher.email,
            status: updatedTeacher.status,
            message: 'Teacher rejected successfully.'
        });
    } else if (teacher && teacher.status !== 'pending') {
        res.status(400);
        throw new Error('Teacher is not pending approval');
    } else {
        res.status(404);
        throw new Error('Teacher not found or is not a pending teacher');
    }
});

// ======================= COURSE APPROVAL =======================

// Retrieve a list of courses pending admin approval
// GET /api/admin/courses/pending
const getPendingCourses = asyncHandler(async (req, res) => {
    // Fetch courses in pending status and include teacher details
    const pendingCourses = await Course.find({ status: 'pending' })
        .populate('teacher', 'name email');
    res.json(pendingCourses);
});

// Approve a pending course
// PUT /api/admin/courses/:id/approve
const approveCourse = asyncHandler(async (req, res) => {
    // Find course by ID
    const course = await Course.findById(req.params.id);

    if (course && course.status === 'pending') {
        course.status = 'approved';
        const updatedCourse = await course.save();
        res.json({ ...updatedCourse.toObject(), message: 'Course approved successfully.' });
    } else if (course && course.status !== 'pending') {
        res.status(400);
        throw new Error('Course is not pending approval');
    } else {
        res.status(404);
        throw new Error('Course not found or is not pending');
    }
});

// Reject a pending course
// PUT /api/admin/courses/:id/reject
const rejectCourse = asyncHandler(async (req, res) => {
    // Find course by ID
    const course = await Course.findById(req.params.id);

    if (course && course.status === 'pending') {
        course.status = 'rejected';
        const updatedCourse = await course.save();
        res.json({ ...updatedCourse.toObject(), message: 'Course rejected successfully.' });
    } else if (course && course.status !== 'pending') {
        res.status(400);
        throw new Error('Course is not pending approval');
    } else {
        res.status(404);
        throw new Error('Course not found or is not pending');
    }
});

// ======================= REVIEW APPROVAL =======================

// Retrieve a list of reviews pending approval
// GET /api/admin/reviews/pending
const getPendingReviews = asyncHandler(async (req, res) => {
    // Fetch reviews and populate associated student and course information
    const pendingReviews = await Review.find({ status: 'pending' })
        .populate('student', 'name email')
        .populate('course', 'title');
    res.json(pendingReviews);
});

// Approve a pending review
// PUT /api/admin/reviews/:id/approve
const approveReview = asyncHandler(async (req, res) => {
    // Find review by ID
    const review = await Review.findById(req.params.id);

    if (review && review.status === 'pending') {
        review.status = 'approved';
        const updatedReview = await review.save();
        res.json({ ...updatedReview.toObject(), message: 'Review approved successfully.' });
    } else if (review && review.status !== 'pending') {
        res.status(400);
        throw new Error('Review is not pending approval');
    } else {
        res.status(404);
        throw new Error('Review not found or is not pending');
    }
});

// Reject a pending review
// PUT /api/admin/reviews/:id/reject
const rejectReview = asyncHandler(async (req, res) => {
    // Find review by ID
    const review = await Review.findById(req.params.id);

    if (review && review.status === 'pending') {
        review.status = 'rejected';
        const updatedReview = await review.save();
        res.json({ ...updatedReview.toObject(), message: 'Review rejected successfully.' });
    } else if (review && review.status !== 'pending') {
        res.status(400);
        throw new Error('Review is not pending approval');
    } else {
        res.status(404);
        throw new Error('Review not found or is not pending');
    }
});

module.exports = {
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
};