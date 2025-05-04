// This file handles course operations including creation, retrieval,
// student enrollment, and fetching course reviews.

const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User'); // For joining logic if needed
const Review = require('../models/Review'); // For review functionalities

// ========================= COURSE CREATION =========================

// Create a new course (for teachers)
// POST /api/courses
// Private: Only approved teachers can create a course.
// Validates input and sets the new course's status to 'pending'
const createCourse = asyncHandler(async (req, res) => {
    // ...existing code...
    const { title, description } = req.body;

    // Validate that all required fields are provided
    if (!title || !description) {
        res.status(400);
        throw new Error('Please provide title and description for the course');
    }

    // Create the course linked to the current teacher
    const course = await Course.create({
        title,
        description,
        teacher: req.user._id,
        status: 'pending',
    });

    if (course) {
        res.status(201).json(course);
    } else {
        res.status(400);
        throw new Error('Invalid course data');
    }
});

// ========================= TEACHER COURSES =========================

// Get all courses created by the logged-in teacher
// GET /api/courses/my
// Private: Only teachers can access their own course list
const getMyCourses = asyncHandler(async (req, res) => {
    // Retrieve courses and sort them by creation date (newest first)
    const courses = await Course.find({ teacher: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
});

// ========================= APPROVED COURSES FOR STUDENTS =========================

// Get all courses approved for viewing by any logged-in user
// GET /api/courses
// Private: Accessible to all authenticated users
const getApprovedCourses = asyncHandler(async (req, res) => {
    // Fetch courses that have been approved, including basic teacher info,
    // and exclude the enrolled students list for brevity
    const courses = await Course.find({ status: 'approved' })
        .populate('teacher', 'name')
        .select('-students')
        .sort({ createdAt: -1 });
    res.json(courses);
});

// Get single course details (only if approved)
// GET /api/courses/:id
// Private: Ensures that only approved courses are accessible
const getCourseById = asyncHandler(async (req, res) => {
    // Find and return course details with additional teacher info
    const course = await Course.findOne({ _id: req.params.id, status: 'approved' })
        .populate('teacher', 'name email');
    if (course) {
        res.json(course);
    } else {
        res.status(404);
        throw new Error('Course not found or not available');
    }
});

// ========================= STUDENT ENROLLMENT =========================

// Allow a student to join an approved course
// PUT /api/courses/:id/join
// Private: Only students should be able to join a course
const joinCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    // Check if the course exists and is approved for joining
    if (!course || course.status !== 'approved') {
        res.status(404);
        throw new Error('Course not found or not available for joining');
    }

    // Ensure the student is not already enrolled
    const alreadyEnrolled = course.students.some(studentId => studentId.equals(req.user._id));
    if (alreadyEnrolled) {
        res.status(400);
        throw new Error('Already enrolled in this course');
    }

    // Add the student to the course and save the updated document
    course.students.push(req.user._id);
    await course.save();

    res.json({ message: 'Successfully joined the course' });
});

// ========================= COURSE REVIEWS =========================

// Get approved reviews for a specific course
// GET /api/courses/:courseId/reviews
// Private: Allows viewing reviews only for courses that are approved
const getApprovedCourseReviews = asyncHandler(async (req, res) => {
    // Ensure the course exists and is approved before fetching reviews
    const courseExists = await Course.findOne({ _id: req.params.courseId, status: 'approved' });
    if (!courseExists) {
        res.status(404);
        throw new Error('Course not found or not available');
    }

    // Retrieve and return reviews with the student's name populated
    const reviews = await Review.find({
        course: req.params.courseId,
        status: 'approved'
    })
        .populate('student', 'name')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

module.exports = {
    createCourse,
    getMyCourses,
    getApprovedCourses,
    getCourseById,
    joinCourse,
    getApprovedCourseReviews,
    // ...existing exports...
};