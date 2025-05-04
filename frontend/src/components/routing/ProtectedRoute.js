// src/components/routing/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner'; // Create this component

const ProtectedRoute = ({ children, roles, requireApproved = false }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show loading indicator while checking auth status
        return <LoadingSpinner />;
    }

    // 1. Check if user is authenticated
    if (!isAuthenticated) {
        // Redirect to login page, passing the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check if route requires specific roles and user has one of them
    if (roles && !roles.includes(user?.role)) {
        // Redirect to a default page or an 'unauthorized' page
        // For simplicity, redirecting to a role-specific dashboard or home
        console.warn(`Access denied: User role (${user?.role}) not in required roles (${roles.join(',')})`);
         // You could navigate to '/' or '/unauthorized' or a role-specific dashboard
         // Redirecting to login might cause loops if already logged in.
         // Let's redirect based on role for now, or show a simple message.
        return ( <div> <h2>Access Denied</h2> <p>You do not have permission to view this page.</p> </div>);
       // return <Navigate to="/" replace />; // Redirect to home/login might be confusing
    }

     // 3. Check if route requires teacher to be approved (only if user is a teacher)
     if (requireApproved && user?.role === 'teacher' && user?.status !== 'approved') {
         console.warn(`Access denied: Teacher account status (${user?.status}) is not 'approved'.`);
         return ( <div> <h2>Access Denied</h2> <p>Your teacher account must be approved to access this page.</p> </div>);
     }


    // If all checks pass, render the child component
    return children;
};

export default ProtectedRoute;