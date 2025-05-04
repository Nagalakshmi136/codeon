import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
    const { user, loading: authLoading, setUser } = useAuth(); 
    const [formData, setFormData] = useState({ name: '', email: '' });
        const [loading, setLoading] = useState(false);
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

        setLoading(true);
        try {
             const payload = {
                name: formData.name,
                email: formData.email,
             };


            const res = await api.put('/api/users/profile', payload);
            setUser(res.data); 
            setSuccess('Profile updated successfully!');
           
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <LoadingSpinner />; 
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};
export default ProfilePage;