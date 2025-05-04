import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
     const { user } = useAuth();
    return (
        <div>
            <h2>Student Dashboard</h2>
             <p>Welcome, {user?.name}!</p>
             <ul>
                 <li><Link to="/courses">Browse Approved Courses</Link></li>
                 <li><Link to="/my-reviews">My Reviews</Link></li>
                 {/* Add link to "My Enrolled Courses" if you add that feature */}
                 <li><Link to="/profile">Edit Profile</Link></li>
             </ul>
        </div>
    );
};
export default StudentDashboard;

