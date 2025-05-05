import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './ApproveTeachers.module.css';

const ApproveTeachers = () => {
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    const fetchPendingTeachers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/api/admin/teachers/pending');
            setPendingTeachers(res.data);
        } catch (err) {
            setError('Failed to load pending teachers.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingTeachers();
    }, [fetchPendingTeachers]);

    const handleApproval = async (id, action) => {
        setActionError('');
        const originalTeachers = [...pendingTeachers];
        setPendingTeachers(currentTeachers => currentTeachers.filter(t => t._id !== id));
        try {
            const endpoint = `/api/admin/teachers/${id}/${action}`;
            await api.put(endpoint);
        } catch (err) {
            setActionError(`Failed to ${action} teacher ${id}.`);
            console.error(err);
            setPendingTeachers(originalTeachers);
        }
    };

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;
    if (error) return <div className={`${styles.centered} ${styles.errorText}`}><p>{error}</p></div>;

    return (
        <div className={styles.approveContainer}>
            <h2 className={styles.title}>Approve Teacher Registrations</h2>
            {actionError && <p className={styles.errorText}>{actionError}</p>}
            {pendingTeachers.length === 0 ? (
                <p>No pending teacher registrations.</p>
            ) : (
                <ul className={styles.teacherList}>
                    {pendingTeachers.map(teacher => (
                        <li key={teacher._id} className={styles.teacherCard}>
                            <div className={styles.teacherDetails}>
                                <span><strong>{teacher.name}</strong> ({teacher.email})</span>
                                <small>Registered: {new Date(teacher.createdAt).toLocaleDateString()}</small>
                            </div>
                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => handleApproval(teacher._id, 'approve')}
                                    className={`${styles.actionButton} ${styles.approveBtn}`}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleApproval(teacher._id, 'reject')}
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

export default ApproveTeachers;