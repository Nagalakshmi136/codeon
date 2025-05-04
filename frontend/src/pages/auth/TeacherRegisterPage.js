import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // No navigate needed here immediately

const TeacherRegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { registerTeacher } = useAuth();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        const result = await registerTeacher(formData.name, formData.email, formData.password);
        if (result.success) {
            setMessage(result.message || 'Registration successful! Waiting for admin approval.');
            setFormData({ name: '', email: '', password: '' }); // Clear form
        } else {
            setError(result.message || 'Registration failed.');
        }
    };

     return (
        <div>
            <h2>Register as Teacher</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Don't show form again after successful message? Maybe */}
             {!message && (
                <form onSubmit={onSubmit}>
                     {/* Form fields for name, email, password */}
                     <div><label>Name:</label><input type="text" name="name" value={formData.name} onChange={onChange} required /></div>
                     <div><label>Email:</label><input type="email" name="email" value={formData.email} onChange={onChange} required /></div>
                     <div><label>Password:</label><input type="password" name="password" value={formData.password} onChange={onChange} required minLength="6" /></div>
                    <button type="submit">Register</button>
                </form>
             )}
             <p>Already registered? <Link to="/login">Login</Link></p>
             <p>Register as a student? <Link to="/register/student">Register Student</Link></p>
        </div>
    );
}
export default TeacherRegisterPage;
