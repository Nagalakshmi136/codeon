import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';
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
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

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

        setIsSubmitting(true);
        let loginAttemptFinished = false;
        let loginSuccess = false;

        try {
            const result = await login(email, password);
            loginAttemptFinished = true;

            if (!isMounted.current) {
                console.log("LoginPage unmounted during login attempt.");
                return;
            }

            if (result.success && result.user) {
                loginSuccess = true;
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

            } else {
                console.log('Login API call failed:', result.message);
                setError(result.message || 'Login Failed. Please check credentials.');
            }
        } catch (error) {
            loginAttemptFinished = true;
            console.error("Unexpected login error in onSubmit:", error);
            if (isMounted.current) {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            // Reset submitting state ONLY if the attempt finished,
            // the component is still mounted, AND login was NOT successful
            if (isMounted.current && loginAttemptFinished && !loginSuccess) {
                console.log("Running finally block in onSubmit. Resetting isSubmitting due to failure/error.");
                setIsSubmitting(false);
            } else if (!isMounted.current) {
                console.log("onSubmit finally block: Component already unmounted.");
            }
        }
    };

    return (
        // Apply container style
        <div className={styles.loginContainer}>
            {/* Apply title style */}
            <h2 className={styles.title}>Login</h2>
            {/* Apply message and error styles */}
            {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
            {/* Apply form style */}
            <form onSubmit={onSubmit} className={styles.loginForm}>
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
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        className={styles.inputField}
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {/* Apply link container style */}
            <p className={styles.registerLink}>
                Don't have an account? <Link to="/register/student">Register as Student</Link> | <Link to="/register/teacher">Register as Teacher</Link>
            </p>
        </div>
    );
};

export default LoginPage;