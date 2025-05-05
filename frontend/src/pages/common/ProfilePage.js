import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import styles from './ProfilePage.module.css'; // Import the CSS Module

const ProfilePage = () => {
    const { user, loading: authLoading, setUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false); // For update operation
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); // Start update loading

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
            };
            const res = await api.put('/api/users/profile', payload);
            // Update user in context with the response from the API
            // Ensure the backend PUT /profile returns the updated user object
            setUser(res.data);
            setSuccess('Profile updated successfully!');

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
            console.error(err);
        } finally {
            setLoading(false); // Stop update loading
        }
    };

    // Use centered style for initial auth loading
    if (authLoading) return <div className={styles.centered}><LoadingSpinner /></div>;

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.title}>My Profile</h2>

            {/* Display success/error messages */}
            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}

            <form onSubmit={onSubmit} className={styles.profileForm}>
                <div className={styles.formGroup}>
                    <label>Role:</label>
                    {/* Use specific disabled style */}
                    <input type="text" value={user?.role || ''} className={styles.inputFieldDisabled} disabled />
                </div>
                <div className={styles.formGroup}>
                    <label>Status:</label>
                    <input type="text" value={user?.status || ''} className={styles.inputFieldDisabled} disabled />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        className={styles.inputField} // Apply input style
                        disabled={loading} // Disable during update
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        className={styles.inputField} // Apply input style
                        disabled={loading} // Disable during update
                    />
                </div>

                {/* Add password fields here if needed, using formGroup and inputField styles */}

                <button
                    type="submit"
                    disabled={loading} // Use component loading state
                    className={styles.submitButton} // Apply button style
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};
export default ProfilePage;