import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './TeacherDashboard.module.css'; // Import the CSS Module

const TeacherDashboard = () => {
    const { user } = useAuth();

    // Helper function to get the correct CSS class based on status
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return styles.statusPending;
            case 'rejected': return styles.statusRejected;
            // Add approved if you create a specific style for it
            // case 'approved': return styles.statusApproved;
            default: return ''; // No extra class if approved or status is unknown
        }
    };

    return (
        // Apply the main container style
        <div className={styles.dashboardContainer}>
            {/* Apply the title style */}
            <h2 className={styles.title}>Teacher Dashboard</h2>

            {/* Conditionally render the status banner using CSS classes */}
            {user?.status !== 'approved' && (
                <div className={`${styles.statusBanner} ${getStatusClass(user?.status)}`}>
                    Your account status is: <strong>{user?.status || 'Unknown'}</strong>.
                    {user?.status === 'pending' && " Please wait for admin approval to create courses."}
                    {user?.status === 'rejected' && " Access might be limited."}
                </div>
            )}

            {/* Apply the welcome message style */}
            <p className={styles.welcomeMessage}>Welcome, {user?.name || 'Teacher'}!</p>

            {/* Apply the container style for action buttons */}
            <div className={styles.actionsContainer}>
                {/* Conditionally render Create Course button */}
                {user?.status === 'approved' && (
                    // Apply base button style AND specific create button style
                    <Link to="/teacher/courses/create" className={`${styles.actionButton} ${styles.createBtn}`}>
                        Create New Course
                    </Link>
                )}
                {/* Apply base button style */}
                <Link to="/teacher/courses/my" className={styles.actionButton}>
                    View My Courses & Status
                </Link>
                {/* Apply base button style */}
                <Link to="/profile" className={styles.actionButton}>
                    Edit My Profile
                </Link>
            </div>
        </div>
    );
};
export default TeacherDashboard;