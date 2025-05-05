import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './CourseListPage.module.css';

const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinError, setJoinError] = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');
    const { user } = useAuth(); // Get user role

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError('');
            setJoinError('');
            setJoinSuccess('');
            try {
                const res = await api.get('/api/courses');
                setCourses(res.data);
            } catch (err) {
                setError('Failed to load courses.');
                console.error("Fetch Courses Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleJoin = async (courseId) => {
        setJoinError('');
        setJoinSuccess('');
        // Find the button for this course to disable it temporarily
        const button = document.getElementById(`join-btn-${courseId}`);
        if (button) button.disabled = true;

        try {
            await api.put(`/api/courses/${courseId}/join`);
            setJoinSuccess(`Successfully requested to join "${courses.find(c => c._id === courseId)?.title || 'course'}"! Refresh might be needed.`);
            // Optionally: Refetch courses or update state to reflect joined status
            // For simplicity, just show message and keep button disabled here
        } catch (err) {
            setJoinError(err.response?.data?.message || `Failed to join course.`);
            console.error("Join Course Error:", err);
            if (button) button.disabled = false; // Re-enable button on error
        }
        // Note: Button remains disabled on success in this simple example
    };


    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;

    return (
        <div className={styles.listContainer}>
            <h2 className={styles.title}>Approved Courses</h2>

            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            {joinError && <p className={`${styles.message} ${styles.error}`}>{joinError}</p>}
            {joinSuccess && <p className={`${styles.message} ${styles.success}`}>{joinSuccess}</p>}

            {courses.length === 0 && !loading ? (
                <p className={styles.noCourses}>No approved courses available at the moment.</p>
            ) : (
                <div className={styles.courseGrid}>
                    {courses.map(course => (
                        <div key={course._id} className={styles.courseCard}>
                            <h3 className={styles.courseTitle}>{course.title}</h3>
                            <p className={styles.teacherInfo}>Taught by: {course.teacher?.name || 'N/A'}</p>
                            <p className={styles.description}>{
                                course.description.length > 100
                                    ? `${course.description.substring(0, 100)}...`
                                    : course.description
                            }</p>
                            <div className={styles.cardActions}>
                                <Link to={`/courses/${course._id}`} className={`${styles.actionButton} ${styles.detailsBtn}`}>
                                    View Details
                                </Link>
                                {/* Show Join button only to students */}
                                {user?.role === 'student' && (
                                    <button
                                        id={`join-btn-${course._id}`} // Add unique ID
                                        onClick={() => handleJoin(course._id)}
                                        className={`${styles.actionButton} ${styles.joinBtn}`}
                                    >
                                        Join Course
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default CourseListPage;