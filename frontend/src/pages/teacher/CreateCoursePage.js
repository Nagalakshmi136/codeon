import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateCoursePage = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await api.post('/api/courses', formData);
            alert('Course created successfully! It is pending admin approval.'); // Simple feedback
            navigate('/teacher/courses/my'); // Redirect to my courses page
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course.');
            console.error(err);
             setSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Create New Course</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={onChange} required />
                </div>
                 <div>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={onChange} required />
                </div>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Create Course'}
                </button>
            </form>
        </div>
    );
};
export default CreateCoursePage;