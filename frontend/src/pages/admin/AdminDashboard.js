import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; // Reuse spinner

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

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {stats ? (
                <div>
                    <p>Total Approved Students: {stats.totalStudents}</p>
                    <p>Total Approved Teachers: {stats.totalTeachers}</p>
                </div>
            ) : (
                <p>No stats available.</p>
            )}
            <hr />
            <h3>Approval Queues</h3>
            <ul>
                <li><Link to="/admin/approve/teachers">Approve Teachers</Link></li>
                <li><Link to="/admin/approve/courses">Approve Courses</Link></li>
                <li><Link to="/admin/approve/reviews">Approve Reviews</Link></li>
            </ul>
        </div>
    );
};

export default AdminDashboard;