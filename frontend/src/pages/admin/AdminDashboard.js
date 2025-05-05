import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                setError('Failed to load dashboard stats.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;
    if (error) return <div className={`${styles.centered} ${styles.errorText}`}><p>{error}</p></div>;

    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.title}>Admin Dashboard</h2>
            <div className={styles.statsContainer}>
                {stats ? (
                    <>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{stats.totalStudents ?? 0}</span>
                            <p className={styles.statLabel}>Approved Students</p>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNumber}>{stats.totalTeachers ?? 0}</span>
                            <p className={styles.statLabel}>Approved Teachers</p>
                        </div>
                    </>
                ) : (
                    <p>No stats available.</p>
                )}
            </div>
            <div className={styles.approvalContainer}>
                <h3 className={styles.approvalTitle}>Approval Queues</h3>
                <Link to="/admin/approve/teachers" className={styles.approvalButton}>
                    Approve Teachers
                </Link>
                <Link to="/admin/approve/courses" className={styles.approvalButton}>
                    Approve Courses
                </Link>
                <Link to="/admin/approve/reviews" className={styles.approvalButton}>
                    Approve Reviews
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;