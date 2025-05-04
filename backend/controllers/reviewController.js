/**
 * @file   Student review endpoints
 */

const asyncHandler = require('express-async-handler');
const Review      = require('../models/Review');
const Course      = require('../models/Course');

/**
 * @desc   Submit a new course review (pending approval)
 * @route  POST /api/courses/:courseId/reviews
 * @access Private (student)
 */
const createReview = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { courseId } = req.params;

    // ensure comment provided
    if (!comment) {
        res.status(400);
        throw new Error('Review comment is required');
    }

    // verify course exists and is approved
    const course = await Course.findById(courseId);
    if (!course || course.status !== 'approved') {
        res.status(404);
        throw new Error('Course not available for review');
    }

    // ensure user is enrolled
    if (!course.students.some(id => id.equals(req.user._id))) {
        res.status(403);
        throw new Error('Enrollment required to review');
    }

    // prevent duplicate review
    if (await Review.findOne({ course: courseId, student: req.user._id })) {
        res.status(400);
        throw new Error('Review already submitted');
    }

    // create review
    const review = await Review.create({
        comment,
        student: req.user._id,
        course: courseId,
        status: 'pending',
    });

    if (review) {
        res.status(201).json({ message: 'Review submitted—awaiting approval.', review });
    } else {
        res.status(400);
        throw new Error('Failed to submit review');
    }
});

/**
 * @desc   Retrieve reviews by the logged‑in student
 * @route  GET /api/reviews/my
 * @access Private (student)
 */
const getMyReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ student: req.user._id })
        .populate('course', 'title')
        .select('comment status createdAt course')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

module.exports = { createReview, getMyReviews };