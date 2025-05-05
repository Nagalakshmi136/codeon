import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './TeacherRegisterPage.module.css'; // Import CSS Module

const TeacherRegisterPage = () => {
    // Include confirmPassword
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState(''); // For success message
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Submitting state
    const { registerTeacher } = useAuth();
    const isMounted = useRef(true); // Mount status ref

    // Destructure confirmPassword
    const { name, email, password, confirmPassword } = formData;

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage(''); // Clear previous success message
        setError('');   // Clear previous error message

        // Basic Validation
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

        setIsSubmitting(true);

        try {
            // Call registerTeacher from context
            // Ensure it returns { success: true, message: '...' } or { success: false, message: '...' }
            const result = await registerTeacher(name, email, password);

            if (!isMounted.current) {
                console.log("TeacherRegisterPage unmounted during registration attempt.");
                return; // Exit if unmounted
            }

            if (result.success) {
                setMessage(result.message || 'Registration successful! Waiting for admin approval.');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Clear form on success
                // No navigation needed here, teacher waits for approval
            } else {
                setError(result.message || 'Registration failed.');
            }
        } catch (error) {
            console.error("Unexpected teacher registration error:", error);
            if (isMounted.current) {
                setError('An unexpected error occurred during registration.');
            }
        } finally {
            // Reset submitting state only if component is still mounted
            if (isMounted.current) {
                setIsSubmitting(false);
            }
        }
    };

    return (
        // Apply container style
        <div className={styles.registerContainer}>
            {/* Apply title style */}
            <h2 className={styles.title}>Register as Teacher</h2>

            {/* Apply message styles */}
            {message && <p className={`${styles.message} ${styles.success}`}>{message}</p>}
            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

            {/* Conditionally render form only if no success message */}
            {!message && (
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
                            className={styles.inputField}
                            disabled={isSubmitting}
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
                            className={styles.inputField}
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
                            className={styles.inputField}
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
                            className={styles.inputField}
                            disabled={isSubmitting}
                        />
                    </div>
                    {/* Apply button style */}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
            )}
            {/* Apply link container styles */}
            <p className={styles.altLink}>
                Already registered or approved? <Link to="/login">Login</Link>
            </p>
            <p className={styles.altLink}>
                Register as a student instead? <Link to="/register/student">Register Student</Link>
            </p>
        </div>
    );
}
export default TeacherRegisterPage; 