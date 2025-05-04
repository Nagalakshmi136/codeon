import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext'; // To check enrollment

// Simple Review Form Component (can be moved to components later)
const ReviewForm = ({ courseId, onReviewSubmitted }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await api.post(`/api/courses/${courseId}/reviews`, { comment });
            setComment(''); // Clear form
            alert('Review submitted for approval!');
            onReviewSubmitted(); // Callback to potentially refresh reviews list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
         <form onSubmit={handleSubmit} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
             <h4>Write a Review</h4>
             {error && <p style={{ color: 'red' }}>{error}</p>}
             <textarea
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 placeholder="Your review..."
                 rows="4"
                 required
                 style={{ width: '100%', marginBottom: '10px' }}
             />
             <button type="submit" disabled={submitting}>
                 {submitting ? 'Submitting...' : 'Submit Review'}
             </button>
         </form>
    );
};


const CourseDetailPage = () => {
    const { courseId } = useParams();
    const { user } = useAuth(); // Get current user
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status


    const fetchCourseAndReviews = async () => {
         setLoading(true);
         setError('');
         try {
            // Fetch course details
            const courseRes = await api.get(`/api/courses/${courseId}`);
            setCourse(courseRes.data);

             // Check enrollment (course object has student IDs)
            if (user && courseRes.data.students?.includes(user._id)) {
                setIsEnrolled(true);
            } else {
                 setIsEnrolled(false);
            }

            // Fetch approved reviews
            const reviewsRes = await api.get(`/api/courses/${courseId}/reviews`);
            setReviews(reviewsRes.data);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load course details or reviews.');
            console.error(err);
            // If course fetch failed, set course to null to show error message
            if (!course) setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseAndReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId, user]); // Reload if courseId changes or user logs in/out

    // Callback for ReviewForm
    const handleReviewSubmitted = () => {
        // Refetch reviews to show the new one (if approved quickly, or just for consistency)
        // For this simple case, maybe just alert user it's pending
        // Or you could try fetching /api/reviews/my and merging if needed complexly
        fetchCourseAndReviews(); // Simplest way is to refetch all
    }


    if (loading) return <LoadingSpinner />;
    // Handle case where course wasn't found (either 404 or status not approved)
    if (!course && !loading) return <p style={{ color: 'red' }}>{error || 'Course not found or is not available.'}</p>;
    // Handle other errors after course is potentially loaded
    if (error && course) return <p style={{ color: 'red' }}>{error}</p>;


    return (
        <div>
            <h2>{course?.title}</h2>
            <p><strong>Teacher:</strong> {course?.teacher?.name}</p>
            <p><strong>Description:</strong> {course?.description}</p>
             {/* Add Join button if needed and not enrolled? */}
             {/* {user && user.role === 'student' && !isEnrolled && <button onClick={handleJoin}>Join Course</button> } */}

            <hr />
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review._id} style={{ borderBottom: '1px dashed #eee', padding: '8px 0' }}>
                           <p>{review.comment}</p>
                           <small>By: {review.student?.name || 'User'} on {new Date(review.createdAt).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            )}

            {/* Show review form only to enrolled students */}
             {user && user.role === 'student' && isEnrolled && (
                <ReviewForm courseId={courseId} onReviewSubmitted={handleReviewSubmitted} />
             )}
             {user && user.role === 'student' && !isEnrolled && (
                 <p style={{ marginTop: '20px', fontStyle:'italic' }}>You must join the course to write a review.</p>
             )}

        </div>
    );
};
export default CourseDetailPage;
