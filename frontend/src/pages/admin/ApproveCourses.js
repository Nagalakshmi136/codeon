import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './ApproveCourses.module.css';

const ApproveCourses = () => {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    const fetchPendingCourses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
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
        const originalCourses = [...pendingCourses];
        setPendingCourses(currentCourses => currentCourses.filter(c => c._id !== id));
        try {
            const endpoint = `/api/admin/courses/${id}/${action}`;
            await api.put(endpoint);
        } catch (err) {
            setActionError(`Failed to ${action} course ${id}. Please try again.`);
            console.error(`Course ${action} Error:`, err.response?.data || err.message);
            setPendingCourses(originalCourses);
        }
    };

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;
    if (error) return <div className={`${styles.centered} ${styles.errorText}`}><p>{error}</p></div>;

    return (
        <div className={styles.approveContainer}>
            <h2 className={styles.title}>Approve Courses</h2>
            {actionError && <p className={styles.errorText}>{actionError}</p>}
            {pendingCourses.length === 0 ? (
                <p>No pending courses to approve.</p>
            ) : (
                <ul className={styles.courseList}>
                    {pendingCourses.map(course => (
                        <li key={course._id} className={styles.courseCard}>
                            <div className={styles.courseDetails}>
                                <h4>{course.title}</h4>
                                <p><strong>Teacher:</strong> {course.teacher?.name || 'N/A'} ({course.teacher?.email || 'N/A'})</p>
                                <p><strong>Description:</strong> {course.description}</p>
                                <small>Submitted: {new Date(course.createdAt).toLocaleString()}</small>
                            </div>
                            <div className={styles.actionButtons}>
                                <button onClick={() => handleApproval(course._id, 'approve')}
                                    className={`${styles.actionButton} ${styles.approveBtn}`}>
                                    Approve
                                </button>
                                <button onClick={() => handleApproval(course._id, 'reject')}
                                    className={`${styles.actionButton} ${styles.rejectBtn}`}>
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

export default ApproveCourses;