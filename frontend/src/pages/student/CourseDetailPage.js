import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import styles from './CourseDetailPage.module.css';

const ReviewForm = ({ courseId, onReviewSubmitted }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!comment.trim()) {
            setError('Review comment cannot be empty.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post(`/api/courses/${courseId}/reviews`, { comment });
            setComment('');
            alert('Review submitted for approval!');
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
            console.error("Submit Review Error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
            <h4 className={styles.formTitle}>Write a Review</h4>
            {error && <p className={styles.errorText}>{error}</p>}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on this course..."
                rows="4"
                required
                className={styles.textAreaField}
                disabled={submitting}
            />
            <button
                type="submit"
                disabled={submitting}
                className={styles.submitButton}
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};


const CourseDetailPage = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false);

    const fetchCourseAndReviews = useCallback(async () => {
        setLoading(true);
        setError('');
        let fetchedCourse = null; // Temporary variable
        try {
            const courseRes = await api.get(`/api/courses/${courseId}`);
            fetchedCourse = courseRes.data; // Store fetched data
            setCourse(fetchedCourse); // Update state

            // Check enrollment based on fetched data and user state
            if (user && fetchedCourse?.students?.includes(user._id)) {
                setIsEnrolled(true);
            } else {
                setIsEnrolled(false);
            }

            const reviewsRes = await api.get(`/api/courses/${courseId}/reviews`);
            setReviews(reviewsRes.data);

        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to load course details or reviews.';
            setError(errMsg);
            console.error(err);
            // If course fetch failed OR the temporary variable is null
            if (err.response?.status === 404 || !fetchedCourse) {
                 setCourse(null); // Ensure course is null on error/not found
            }
        } finally {
            setLoading(false);
        }
    // Dependencies: Only include variables from *outside* the useCallback
    // that are used *inside* it. 'course' state is NOT used to fetch, only set.
    }, [courseId, user]);

    useEffect(() => {
        fetchCourseAndReviews();
    // The dependency array now correctly refers to the memoized function
    }, [fetchCourseAndReviews]);

    // handleReviewSubmitted depends on fetchCourseAndReviews, so use useCallback
    const handleReviewSubmitted = useCallback(() => {
        fetchCourseAndReviews();
    }, [fetchCourseAndReviews]); // Dependency is the memoized function

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;
    // Check based on the 'course' state variable AFTER loading is false
    if (!course && !loading) return <div className={`${styles.centered} ${styles.errorText}`}><p>{error || 'Course not found or is not available.'}</p></div>;
    // Show error even if old course data might exist briefly
    if (error && !loading) return <div className={`${styles.centered} ${styles.errorText}`}><p>{error}</p></div>;


    return (
        <div className={styles.detailContainer}>
            <div className={styles.courseInfoCard}>
                <h2 className={styles.courseTitle}>{course?.title}</h2>
                <p className={styles.teacherInfo}><strong>Teacher:</strong> {course?.teacher?.name}</p>
                <p className={styles.description}>{course?.description}</p>
            </div>

            <div className={styles.reviewsSection}>
                <h3 className={styles.reviewsTitle}>Reviews</h3>
                {reviews.length === 0 ? (
                    <p className={styles.noReviews}>No approved reviews yet.</p>
                ) : (
                    <ul className={styles.reviewList}>
                        {reviews.map(review => (
                            <li key={review._id} className={styles.reviewItem}>
                                <p className={styles.reviewComment}>"{review.comment}"</p>
                                <small className={styles.reviewAuthor}>
                                    By: {review.student?.name || 'User'} on {new Date(review.createdAt).toLocaleDateString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {user && user.role === 'student' && isEnrolled && (
                <div className={styles.reviewFormContainer}>
                     <ReviewForm courseId={courseId} onReviewSubmitted={handleReviewSubmitted} />
                </div>
            )}
            {user && user.role === 'student' && !isEnrolled && (
                <p className={styles.enrollMessage}>You must join the course to write a review.</p>
            )}
        </div>
    );
};
export default CourseDetailPage;