import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; 
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; 
import { Link } from 'react-router-dom'; 

const ApproveReviews = () => {
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState(''); 

    const fetchPendingReviews = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch reviews with status 'pending'
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
            const endpoint = `/api/admin/reviews/${id}/${action}`; // action is 'approve' or 'reject'
            await api.put(endpoint);
        } catch (err) {
            setActionError(`Failed to ${action} review ${id}. Please try again.`);
            console.error(`Review ${action} Error:`, err.response?.data || err.message);
            setPendingReviews(originalReviews);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Approve Reviews</h2>
            {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
            {pendingReviews.length === 0 ? (
                <p>No pending reviews to approve.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {pendingReviews.map(review => (
                        <li key={review._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p>"{review.comment}"</p>
                                <p>
                                    <strong>Student:</strong> {review.student?.name || 'N/A'} ({review.student?.email || 'N/A'})
                                    <br />
                                    <strong>Course:</strong> <Link to={`/courses/${review.course?._id}`}>{review.course?.title || 'N/A (ID: ' + review.course?._id + ')'}</Link>
                                </p>
                                <small>Submitted: {new Date(review.createdAt).toLocaleString()}</small>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                                <button onClick={() => handleApproval(review._id, 'approve')} style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Approve</button>
                                <button onClick={() => handleApproval(review._id, 'reject')} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApproveReviews;