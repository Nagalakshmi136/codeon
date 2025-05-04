// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add an interceptor to automatically set the Authorization header
// This is an alternative to setting it in AuthContext after login/loadUser
 api.interceptors.request.use(
   (config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers['Authorization'] = `Bearer ${token}`;
     }
     return config;
   },
   (error) => {
     return Promise.reject(error);
   }
 );

export default api;