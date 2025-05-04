// src/pages/auth/LoginPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { email, password } = formData;
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true; // Set to true on mount
        return () => {
            isMounted.current = false; // Set to false on unmount
        };
    }, []);

    // Effect for redirecting already authenticated users (keep as is)
    useEffect(() => {
        if (isAuthenticated && user) {
            console.log("User already authenticated on mount/update, redirecting...");
            const targetPath = user.role === 'admin' ? '/admin/dashboard'
                            : user.role === 'teacher' ? '/teacher/dashboard'
                            : '/student/dashboard';
            navigate(targetPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        if (isSubmitting) return;

        setIsSubmitting(true); // Set submitting ON

        let loginAttemptFinished = false; // Flag to control finally block logic

        try {
            const result = await login(email, password);
            loginAttemptFinished = true; // Mark that the async call completed

            // --- Check Mount Status AFTER await ---
            if (!isMounted.current) {
                console.log("LoginPage unmounted during login attempt.");
                return; // Exit if component unmounted
            }
            // --- End Check Mount Status ---

            if (result.success && result.user) {
                // SUCCESS PATH: Navigation will happen, no need to reset isSubmitting here.
                const loggedInUser = result.user;
                console.log('Login API call successful, navigating based on role:', loggedInUser.role);
                const intendedPath = location.state?.from?.pathname;
                let targetPath = intendedPath || (
                    loggedInUser.role === 'admin' ? '/admin/dashboard' :
                    loggedInUser.role === 'teacher' ? '/teacher/dashboard' :
                    '/student/dashboard'
                );
                console.log(`Navigating to: ${targetPath}`);
                navigate(targetPath, { replace: true });
                // Note: setIsSubmitting is NOT set to false here

            } else {
                // FAILURE PATH (API returned success: false)
                console.log('Login API call failed:', result.message);
                setError(result.message || 'Login Failed. Please check credentials.');
                // We will reset isSubmitting in the finally block
            }
        } catch (error) {
            // UNEXPECTED ERROR PATH (Network error, etc.)
            loginAttemptFinished = true; // Mark that the async call completed (with error)
            console.error("Unexpected login error in onSubmit:", error);
            if (isMounted.current) { // Check mount status before setting state
                 setError('An unexpected error occurred during login. Check console.');
            }
             // We will reset isSubmitting in the finally block
        } finally {
            // This block runs after try/catch, regardless of success/failure of the promise inside try
            // Check if the component is still mounted AND the login attempt finished (didn't exit early)
            if (isMounted.current && loginAttemptFinished) {
                 // Find out if navigation is about to happen or just happened
                 // This is tricky, as navigate() is async in terms of effect
                 // A simpler approach for finally: always reset if NO navigation occurred.
                 // We know navigation only happens if result.success was true.
                 // Let's refine: reset only if setError was called OR an unexpected error happened.

                 // A robust way: Check if error state IS set OR if catch block was hit.
                 // But simpler: just reset the button if still mounted AFTER the attempt.
                 // The navigation should unmount the component anyway if successful.
                 console.log("Running finally block in onSubmit. Resetting isSubmitting.");
                 setIsSubmitting(false); // Reset submitting state OFF reliably
            } else if (!isMounted.current) {
                console.log("onSubmit finally block: Component already unmounted.");
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                 <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={onChange} required disabled={isSubmitting}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={onChange} required disabled={isSubmitting} />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/register/student">Register as Student</Link> | <Link to="/register/teacher">Register as Teacher</Link>
            </p>
        </div>
    );
};

export default LoginPage;