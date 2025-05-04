// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // Make sure api is imported correctly

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // useEffect to load user on initial render or token change (Keep this)
    useEffect(() => {
        const loadUser = async () => {
            // Use the current 'token' state variable here
            const currentToken = localStorage.getItem('token'); // Or read directly for safety
            if (currentToken) {
                try {
                    // Set token for current and future requests IN THIS SESSION
                    api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
                    const res = await api.get('/api/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error('Error loading user on initial load', err.response ? err.response.data : err.message);
                    // Clear invalid token and state if /me fails
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null); // Make sure user is cleared
                    delete api.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        loadUser();
        // Dependency array should likely just be empty [] if you only want
        // this to run once on mount, or include token if you want it
        // to re-run if the token state variable changes externally.
        // Let's keep it simple for now, assuming token is set by login/logout:
    }, []); // Run once on mount


    // Login User (ensure it returns user data as discussed previously)
    const login = async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            console.log(res);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token); // Update state
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; // Set header
            setUser(res.data); // Update user state
            return { success: true, user: res.data }; // Return user data
        } catch (err) {
            console.error('Login failed in AuthContext:', err.response ? err.response.data : err.message); // Log the specific error

            // --- CRITICAL CLEANUP ON FAILURE ---
            localStorage.removeItem('token'); // Remove any potentially stale token
            setToken(null);                   // Clear token state
            setUser(null);                    // Clear user state
            delete api.defaults.headers.common['Authorization']; // Clear API header
            // --- END CRITICAL CLEANUP ---

            // Return failure status and message
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    // Register Student (Keep as is, ensuring it sets state correctly)
    const registerStudent = async (name, email, password) => {
        try {
            const res = await api.post('/api/auth/register/student', { name, email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            setUser(res.data);
            return { success: true };
        } catch (err) {
            // Handle error, ensure state is clean if registration partially worked then failed? unlikely
            console.error('Student registration failed', err.response ? err.response.data : err);
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };

    // Register Teacher (Keep as is)
    const registerTeacher = async (name, email, password) => {
        try {
            const res = await api.post('/api/auth/register/teacher', { name, email, password });
            return { success: true, message: res.data.message };
        } catch (err) {
            console.error('Teacher registration failed', err.response ? err.response.data : err);
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };


    // ----- CORRECT LOGOUT FUNCTION -----
    const logout = () => {
        console.log('Logging out...'); // Add log for debugging
        // 1. Remove token from local storage
        localStorage.removeItem('token');
        // 2. Clear token state
        setToken(null);
        // 3. Clear user state
        setUser(null);
        // 4. Remove the Authorization header from future Axios requests
        delete api.defaults.headers.common['Authorization'];
        // 5. Optional: Add any other cleanup logic if needed
    };
    // ----- END CORRECT LOGOUT FUNCTION -----


    return (
        // Make sure 'logout' is included in the value passed to consumers
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: !!user, // Derived state: true if user object exists
            login,
            registerStudent,
            registerTeacher,
            logout, // EXPOSE THE LOGOUT FUNCTION
            setUser // Expose setUser if needed for profile updates etc.
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext (Keep as is)
export const useAuth = () => {
    return useContext(AuthContext);
};

