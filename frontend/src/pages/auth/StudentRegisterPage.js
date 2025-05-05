import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './StudentRegisterPage.module.css'; // Import CSS Module

const StudentRegisterPage = () => {
    // Include confirmPassword in initial state
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { registerStudent, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    // Destructure confirmPassword as well
    const { name, email, password, confirmPassword } = formData;

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);


    // Redirect if user becomes authenticated after registration
    useEffect(() => {
        if (isAuthenticated && user?.role === 'student') {
            console.log('Student registered and logged in, navigating to dashboard...');
            navigate('/student/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        // Basic validation
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true); // Set submitting ON

        let registrationSuccess = false; // Track success for finally block

        try {
            // Call registerStudent from context
            // Ensure it returns { success: true } or { success: false, message: '...' }
            const result = await registerStudent(name, email, password);

            if (!isMounted.current) {
                console.log("StudentRegisterPage unmounted during registration attempt.");
                return; // Exit if unmounted
            }

            if (result.success) {
                registrationSuccess = true; // Mark success
                // Navigation is handled by the useEffect hook, no direct action needed here
                console.log('Student registration successful in onSubmit');
            } else {
                // Registration failed via API/Context
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error("Unexpected registration error:", error);
            if (isMounted.current) {
                setError('An unexpected error occurred during registration.');
            }
        } finally {
            // Reset submitting state only if the attempt finished, component mounted, AND registration failed
            if (isMounted.current && !registrationSuccess) {
                console.log("StudentRegisterPage: onSubmit finally block - Resetting isSubmitting due to failure/error.");
                setIsSubmitting(false);
            } else if (!isMounted.current) {
                console.log("StudentRegisterPage: onSubmit finally block - Component already unmounted.");
            }
        }
    };

    return (
        // Apply container style
        <div className={styles.registerContainer}>
            {/* Apply title style */}
            <h2 className={styles.title}>Register as Student</h2>
            {/* Apply message and error styles */}
            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            {/* Apply form style */}
            <form onSubmit={onSubmit} className={styles.registerForm}>
                {/* Apply form group style */}
                <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                        className={styles.inputField} // Apply input style
                        disabled={isSubmitting} // Disable while submitting
                    />
                </div>
                {/* Apply form group style */}
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        className={styles.inputField} // Apply input style
                        disabled={isSubmitting}
                    />
                </div>
                {/* Apply form group style */}
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password (min 6 chars):</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                        className={styles.inputField} // Apply input style
                        disabled={isSubmitting}
                    />
                </div>
                {/* Apply form group style */}
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        required
                        minLength="6"
                        className={styles.inputField} // Apply input style
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    className={styles.submitButton} // Apply button style
                    disabled={isSubmitting} // Disable while submitting
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
            {/* Apply link container styles */}
            <p className={styles.altLink}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
            <p className={styles.altLink}>
                Register as a teacher instead? <Link to="/register/teacher">Register Teacher</Link>
            </p>
        </div>
    );
};

export default StudentRegisterPage;