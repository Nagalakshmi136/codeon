import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

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
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    // Function to determine status color
    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return { color: 'green', fontWeight: 'bold' };
            case 'pending': return { color: 'orange', fontWeight: 'bold' };
            case 'rejected': return { color: 'red', fontWeight: 'bold' };
            default: return {};
        }
    };


    return (
        <div>
            <h2>My Courses</h2>
            {courses.length === 0 ? (
                <p>You haven't created any courses yet. <Link to="/teacher/courses/create">Create one?</Link></p>
            ) : (
                <ul>
                    {courses.map(course => (
                        <li key={course._id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                           <strong>{course.title}</strong> - Status: <span style={getStatusStyle(course.status)}>{course.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default MyCoursesPage;