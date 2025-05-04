import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReviews();
    }, []);

     if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

     const getStatusStyle = (status) => { // Same as in MyCourses
        switch (status) {
            case 'approved': return { color: 'green', fontWeight: 'bold' };
            case 'pending': return { color: 'orange', fontWeight: 'bold' };
            case 'rejected': return { color: 'red', fontWeight: 'bold' };
            default: return {};
        }
    };

    return (
         <div>
            <h2>My Submitted Reviews</h2>
            {reviews.length === 0 ? (
                <p>You haven't submitted any reviews yet.</p>
            ) : (
                <ul>
                    {reviews.map(review => (
                        <li key={review._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                           <p><strong>Course:</strong> {review.course?.title || 'N/A'}</p>
                           <p><strong>Review:</strong> {review.comment}</p>
                           <p><strong>Status:</strong> <span style={getStatusStyle(review.status)}>{review.status}</span></p>
                           <small>Submitted on: {new Date(review.createdAt).toLocaleDateString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default MyReviewsPage;