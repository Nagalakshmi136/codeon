// src/pages/auth/StudentRegisterPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const StudentRegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { registerStudent, user, isAuthenticated } = useAuth(); // Get registerStudent function and user state
    const navigate = useNavigate();

    const { name, email, password } = formData;

    // Redirect if user becomes authenticated after registration
    useEffect(() => {
        if (isAuthenticated && user?.role === 'student') { // Check if logged in specifically as student
             console.log('Student registered and logged in, navigating to dashboard...');
            // Redirect to the student dashboard upon successful registration/login
            navigate('/student/dashboard', { replace: true });
        }
        // Dependency array includes isAuthenticated and user role to trigger check after state updates
    }, [isAuthenticated, user, navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        // Optional: Add more validation like password match if you add confirm password field

        const result = await registerStudent(name, email, password);

        if (!result.success) {
            // If registration failed, display the error message from the context/API
            setError(result.message || 'Registration failed. Please try again.');
        }
        // If registration is successful, the useEffect hook will handle the redirection
        // No need to clear form or set success message here, as we navigate away
    };

    return (
        <div>
            <h2>Register as Student</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6" // Example validation
                    />
                </div>
                {/* Optional: Add Confirm Password field here */}
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
            <p>
                Register as a teacher instead? <Link to="/register/teacher">Register Teacher</Link>
            </p>
        </div>
    );
};

export default StudentRegisterPage;