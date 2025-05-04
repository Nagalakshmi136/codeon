import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; 
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; 

const ApproveCourses = () => {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState(''); 

    const fetchPendingCourses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch courses with status 'pending'
            const res = await api.get('/api/admin/courses/pending');
            setPendingCourses(res.data);
        } catch (err) {
            setError('Failed to load pending courses.');
            console.error('Fetch Pending Courses Error:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchPendingCourses();
    }, [fetchPendingCourses]); 

    const handleApproval = async (id, action) => {
        setActionError('');
        // Store original state for potential rollback on error
        const originalCourses = [...pendingCourses];
        setPendingCourses(currentCourses => currentCourses.filter(c => c._id !== id));

        try {
            const endpoint = `/api/admin/courses/${id}/${action}`; // action is 'approve' or 'reject'
            await api.put(endpoint);
        } catch (err) {
            setActionError(`Failed to ${action} course ${id}. Please try again.`);
            console.error(`Course ${action} Error:`, err.response?.data || err.message);
            setPendingCourses(originalCourses);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Approve Courses</h2>
            {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
            {pendingCourses.length === 0 ? (
                <p>No pending courses to approve.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {pendingCourses.map(course => (
                        <li key={course._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h4>{course.title}</h4>
                                <p><strong>Teacher:</strong> {course.teacher?.name || 'N/A'} ({course.teacher?.email || 'N/A'})</p>
                                <p><strong>Description:</strong> {course.description}</p>
                                <small>Submitted: {new Date(course.createdAt).toLocaleString()}</small>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                                <button onClick={() => handleApproval(course._id, 'approve')} style={{ background: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Approve</button>
                                <button onClick={() => handleApproval(course._id, 'reject')} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApproveCourses;