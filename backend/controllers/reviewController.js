// This file handles review operations including creating a new review for a course
// and retrieving reviews submitted by the logged-in student.

const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Create a new review for a course
// @route   POST /api/courses/:courseId/reviews
// @access  Private/Student
const createReview = asyncHandler(async (req, res) => {
    // Extract the comment from the request body; rating can be added later if needed
    const { comment } = req.body;
    const { courseId } = req.params;

    // Validate that a review comment is provided
    if (!comment) {
        res.status(400);
        throw new Error('Review comment cannot be empty');
    }

    // 1. Confirm that the course exists and is approved for review
    const course = await Course.findById(courseId);
    if (!course || course.status !== 'approved') {
        res.status(404);
        throw new Error('Course not found or not available for review');
    }

    // 2. Check that the student is enrolled in the course
    const isEnrolled = course.students.some(studentId => studentId.equals(req.user._id));
    if (!isEnrolled) {
        res.status(403); // Forbidden: not eligible to review
        throw new Error('You must be enrolled in the course to write a review');
    }

    // 3. Optionally ensure that the student has not already submitted a review for this course
    const existingReview = await Review.findOne({ course: courseId, student: req.user._id });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this course');
    }

    // 4. Create the review with an initial 'pending' status
    const review = await Review.create({
        comment,
        // rating, // Uncomment if ratings are implemented
        student: req.user._id,
        course: courseId,
        status: 'pending',
    });

    if (review) {
        res.status(201).json({ message: 'Review submitted successfully. Waiting for approval.', review });
    } else {
        res.status(400);
        throw new Error('Failed to submit review');
    }
});

// @desc    Get reviews submitted by the logged-in student
// @route   GET /api/reviews/my
// @access  Private/Student
const getMyReviews = asyncHandler(async (req, res) => {
    // Retrieve reviews where the current user is the author
    const reviews = await Review.find({ student: req.user._id })
                                .populate('course', 'title') // Populate course title for context
                                .select('comment status createdAt course')
                                .sort({ createdAt: -1 });

    res.json(reviews);
});

module.exports = {
    createReview,
    getMyReviews,
};