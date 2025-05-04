// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

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
                    setUser(null);
                    delete api.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    // Login User returns user data
    const login = async (email, password) => {
        try {
            const res = await api.post('/api/auth/login', { email, password });
            console.log(res);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            setUser(res.data);
            return { success: true, user: res.data };
        } catch (err) {
            console.error('Login failed in AuthContext:', err.response ? err.response.data : err.message);

            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete api.defaults.headers.common['Authorization'];
            // Return failure status and message
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    // Register Student 
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

    // Register Teacher 
    const registerTeacher = async (name, email, password) => {
        try {
            const res = await api.post('/api/auth/register/teacher', { name, email, password });
            return { success: true, message: res.data.message };
        } catch (err) {
            console.error('Teacher registration failed', err.response ? err.response.data : err);
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    };


    const logout = () => {
        console.log('Logging out...');
        // 1. Remove token from local storage
        localStorage.removeItem('token');
        // 2. Clear token state
        setToken(null);
        // 3. Clear user state
        setUser(null);
        // 4. Remove the Authorization header from future Axios requests
        delete api.defaults.headers.common['Authorization'];
    };


    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isAuthenticated: !!user, 
            login,
            registerStudent,
            registerTeacher,
            logout,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext (Keep as is)
export const useAuth = () => {
    return useContext(AuthContext);
};

