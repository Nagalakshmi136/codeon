import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
    const { user, loading: authLoading, setUser } = useAuth(); // Get setUser to update context
    const [formData, setFormData] = useState({ name: '', email: '' });
    // Add password fields if allowing password change:
    // const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Populate form when user data is available
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        // Add password confirmation check if needed
        // if (formData.password && formData.password !== formData.confirmPassword) {
        //     setError('Passwords do not match');
        //     return;
        // }

        setLoading(true);
        try {
             // Construct payload - only send fields that might change
             const payload = {
                name: formData.name,
                email: formData.email,
             };
             // if (formData.password) { // Only include password if entered
             //    payload.password = formData.password;
             // }

            const res = await api.put('/api/users/profile', payload);
            setUser(res.data); // Update user in AuthContext
            setSuccess('Profile updated successfully!');
            // Clear password fields after successful update
            // setFormData(prev => ({...prev, password: '', confirmPassword: ''}));

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <LoadingSpinner />; // Wait for user data to load initially

    return (
        <div>
            <h2>My Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={onSubmit}>
                 <div>
                    <label>Role:</label>
                    <input type="text" value={user?.role || ''} disabled />
                </div>
                 <div>
                    <label>Status:</label>
                     <input type="text" value={user?.status || ''} disabled />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={onChange} required />
                </div>
                 <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={onChange} required />
                </div>
                {/* Add password fields if needed */}
                 {/* <div><label>New Password:</label><input type="password" name="password" value={formData.password} onChange={onChange} minLength="6"/></div> */}
                 {/* <div><label>Confirm New Password:</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} /></div> */}

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};
export default ProfilePage;