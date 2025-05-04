import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
    const { user } = useAuth();
    return (
        <div>
            <h2>Teacher Dashboard</h2>
            {user?.status !== 'approved' && (
                <p style={{ color: 'orange', border: '1px solid orange', padding: '10px' }}>
                    Your account status is: <strong>{user?.status}</strong>. You may have limited access until approved.
                </p>
            )}
            <p>Welcome, {user?.name}!</p>
            <ul>
                {user?.status === 'approved' && (
                    <li><Link to="/teacher/courses/create">Create New Course</Link></li>
                )}
                <li><Link to="/teacher/courses/my">View My Courses</Link></li>
                <li><Link to="/profile">Edit Profile</Link></li>
            </ul>
        </div>
    );
};
export default TeacherDashboard;

