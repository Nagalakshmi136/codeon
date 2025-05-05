import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import styles from './ApproveReviews.module.css';

const ApproveReviews = () => {
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    const fetchPendingReviews = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/admin/reviews/pending');
            setPendingReviews(res.data);
        } catch (err) {
            setError('Failed to load pending reviews.');
            console.error('Fetch Pending Reviews Error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingReviews();
    }, [fetchPendingReviews]);

    const handleApproval = async (id, action) => {
        setActionError('');
        const originalReviews = [...pendingReviews];
        setPendingReviews(currentReviews => currentReviews.filter(r => r._id !== id));
        try {
            const endpoint = `/api/admin/reviews/${id}/${action}`;
            await api.put(endpoint);
        } catch (err) {
            setActionError(`Failed to ${action} review ${id}. Please try again.`);
            console.error(`Review ${action} Error:`, err.response?.data || err.message);
            setPendingReviews(originalReviews);
        }
    };

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;
    if (error) return <div className={`${styles.centered} ${styles.errorText}`}><p>{error}</p></div>;

    return (
        <div className={styles.approveContainer}>
            <h2 className={styles.title}>Approve Reviews</h2>
            {actionError && <p className={styles.errorText}>{actionError}</p>}
            {pendingReviews.length === 0 ? (
                <p>No pending reviews to approve.</p>
            ) : (
                <ul className={styles.reviewList}>
                    {pendingReviews.map(review => (
                        <li key={review._id} className={styles.reviewCard}>
                            <div className={styles.reviewDetails}>
                                <p className={styles.reviewComment}>"{review.comment}"</p>
                                <p className={styles.reviewInfo}>
                                    <strong>Student:</strong> {review.student?.name || 'N/A'} ({review.student?.email || 'N/A'})
                                    <br />
                                    <strong>Course:</strong> <Link to={`/courses/${review.course?._id}`}>{review.course?.title || ('N/A (ID: ' + review.course?._id + ')')}</Link>
                                </p>
                                <small>Submitted: {new Date(review.createdAt).toLocaleString()}</small>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => handleApproval(review._id, 'approve')}
                                    className={`${styles.actionButton} ${styles.approveBtn}`}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleApproval(review._id, 'reject')}
                                    className={`${styles.actionButton} ${styles.rejectBtn}`}
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApproveReviews;