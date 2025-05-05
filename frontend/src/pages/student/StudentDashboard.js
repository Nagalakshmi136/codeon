import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './StudentDashboard.module.css'; // Import CSS Module

const StudentDashboard = () => {
    const { user } = useAuth();

    return (
        <div className={styles.dashboardContainer}>
            <h2 className={styles.title}>Student Dashboard</h2>
            <p className={styles.welcomeMessage}>Welcome, {user?.name || 'Student'}!</p>

            <div className={styles.actionsContainer}>
                <Link to="/courses" className={styles.actionButton}>
                    Browse Courses
                </Link>
                <Link to="/my-reviews" className={styles.actionButton}>
                    My Submitted Reviews
                </Link>
                <Link to="/profile" className={styles.actionButton}>
                    Edit My Profile
                </Link>
                {/* Add more relevant student links here if needed */}
            </div>
        </div>
    );
};
export default StudentDashboard;