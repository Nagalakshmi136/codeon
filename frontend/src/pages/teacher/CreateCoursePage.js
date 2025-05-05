import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styles from './CreateCoursePage.module.css'; // Import CSS Module

const CreateCoursePage = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!formData.title.trim() || !formData.description.trim()) {
            setError("Title and Description cannot be empty.");
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/api/courses', formData);
            alert('Course created successfully! It is pending admin approval.');
            navigate('/teacher/courses/my');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course.');
            console.error("Create Course Error:", err);
            setSubmitting(false); // Only reset submitting state on error
        }
        // Don't reset submitting state on success because we navigate away
    };

    return (
        <div className={styles.createContainer}>
            <h2 className={styles.title}>Create New Course</h2>
            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            <form onSubmit={onSubmit} className={styles.courseForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Course Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        required
                        className={styles.inputField}
                        disabled={submitting}
                    />
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="description">Course Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        required
                        rows="6" // Give more rows for description
                        className={styles.textAreaField}
                        disabled={submitting}
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitButton}
                >
                    {submitting ? 'Creating...' : 'Create Course'}
                </button>
            </form>
        </div>
    );
};
export default CreateCoursePage;