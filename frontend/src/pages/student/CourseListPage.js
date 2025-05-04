import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinError, setJoinError] = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');


    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/api/courses'); 
                setCourses(res.data);
            } catch (err) {
                setError('Failed to load courses.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

     const handleJoin = async (courseId) => {
        setJoinError('');
        setJoinSuccess('');
        try {
            await api.put(`/api/courses/${courseId}/join`);
            setJoinSuccess(`Successfully joined course ${courseId}!`); 
        } catch (err) {
            setJoinError(err.response?.data?.message || `Failed to join course ${courseId}.`);
            console.error(err);
        }
    };


    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Approved Courses</h2>
            {joinError && <p style={{ color: 'red' }}>{joinError}</p>}
            {joinSuccess && <p style={{ color: 'green' }}>{joinSuccess}</p>}
            {courses.length === 0 ? (
                <p>No approved courses available at the moment.</p>
            ) : (
                <div>
                    {courses.map(course => (
                        <div key={course._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px' }}>
                           <h3>{course.title}</h3>
                           <p>Teacher: {course.teacher?.name || 'N/A'}</p>
                           <p>{course.description}</p>
                           <Link to={`/courses/${course._id}`} style={{marginRight: '10px'}}>View Details</Link>
                           <button onClick={() => handleJoin(course._id)}>Join Course</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default CourseListPage;