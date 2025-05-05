import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import styles from './MyCoursesPage.module.css'; // Import CSS Module

const MyCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyCourses = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/api/courses/my');
                setCourses(res.data);
            } catch (err) {
                setError('Failed to load your courses.');
                console.error("Fetch My Courses Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return styles.statusApproved;
            case 'pending': return styles.statusPending;
            case 'rejected': return styles.statusRejected;
            default: return '';
        }
    };

    if (loading) return <div className={styles.centered}><LoadingSpinner /></div>;

    return (
        <div className={styles.coursesContainer}>
            <h2 className={styles.title}>My Created Courses</h2>

            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

            {courses.length === 0 && !loading ? (
                <div className={styles.noCoursesContainer}>
                    <p className={styles.noCourses}>You haven't created any courses yet.</p>
                    <Link to="/teacher/courses/create" className={styles.createButton}>
                        Create Your First Course
                    </Link>
                </div>
            ) : (
                <ul className={styles.courseList}>
                    {courses.map(course => (
                        <li key={course._id} className={styles.courseCard}>
                            <div className={styles.courseInfo}>
                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                <p className={styles.description}>
                                    {course.description.length > 150 ? `${course.description.substring(0, 150)}...` : course.description}
                                </p>
                                <small className={styles.submittedDate}>
                                    Submitted: {new Date(course.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                            <div className={styles.statusSection}>
                                <span className={`${styles.statusBadge} ${getStatusClass(course.status)}`}>
                                    {course.status}
                                </span>
                                {/* Optional: Add View/Edit links here if functionality exists */}
                                {/* <Link to={`/teacher/courses/edit/${course._id}`}>Edit</Link> */}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default MyCoursesPage;