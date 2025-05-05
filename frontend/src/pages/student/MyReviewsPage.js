import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './MyReviewsPage.module.css';
import { Link } from 'react-router-dom';

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyReviews = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/api/reviews/my');
                setReviews(res.data);
            } catch (err) {
                setError('Failed to load your reviews.');
                console.error("Fetch My Reviews Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReviews();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return styles.statusApproved;
            case 'pending': return styles.statusPending;
            case 'rejected': return styles.statusRejected;
            default: return '';
        }
    };

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;

    return (
        <div className={styles.reviewsContainer}>
            <h2 className={styles.title}>My Submitted Reviews</h2>

            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

            {reviews.length === 0 && !loading ? (
                <p className={styles.noReviews}>You haven't submitted any reviews yet.</p>
            ) : (
                <ul className={styles.reviewList}>
                    {reviews.map(review => (
                        <li key={review._id} className={styles.reviewCard}>
                            <p className={styles.courseLink}>
                                <strong>Course:</strong>{' '}
                                <Link to={`/courses/${review.course?._id}`}>
                                    {review.course?.title || 'N/A'}
                                </Link>
                            </p>
                            <p className={styles.reviewComment}>
                                <strong>Review:</strong> {review.comment}
                            </p>
                            <p className={styles.statusInfo}>
                                <strong>Status:</strong>{' '}
                                <span className={`${styles.statusBadge} ${getStatusClass(review.status)}`}>
                                    {review.status}
                                </span>
                            </p>
                            <small className={styles.submittedDate}>
                                Submitted on: {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default MyReviewsPage;