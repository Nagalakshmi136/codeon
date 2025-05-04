import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    // Don't render navbar content until loading is complete
    if (loading) {
        return (
             <nav style={navStyle}>
                <div style={containerStyle}>
                    <Link to="/" style={linkStyle}>LMS</Link>
                    <span>Loading...</span>
                </div>
            </nav>
        )
    }

    const authLinks = (
        <div>
            <span style={{ marginRight: '15px', color: '#fff' }}>Welcome, {user?.name} ({user?.role})</span>
            {/* Role-specific Links */}
            {user?.role === 'admin' && <Link to="/admin/dashboard" style={linkStyle}>Admin Dash</Link>}
            {user?.role === 'teacher' && <Link to="/teacher/dashboard" style={linkStyle}>Teacher Dash</Link>}
            {user?.role === 'student' && <Link to="/student/dashboard" style={linkStyle}>Student Dash</Link>}

             {/* Common Links for logged-in users */}
             {(user?.role === 'student' || user?.role === 'teacher') && <Link to="/courses" style={linkStyle}>Courses</Link>}
             <Link to="/profile" style={linkStyle}>Profile</Link>

            <button onClick={handleLogout} style={buttonStyle}>
                Logout
            </button>
        </div>
    );

    const guestLinks = (
        <div>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register/student" style={linkStyle}>Register Student</Link>
            <Link to="/register/teacher" style={linkStyle}>Register Teacher</Link>
        </div>
    );

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <Link to="/" style={{...linkStyle, fontSize: '1.5rem'}}>LMS</Link>
                <div>{isAuthenticated ? authLinks : guestLinks}</div>
            </div>
        </nav>
    );
};

const navStyle = {
    background: '#333',
    color: '#fff',
    padding: '0.7rem',
    position: 'fixed', 
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000, 
};

const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    margin: '0 0.7rem',
};

const buttonStyle = {
    background: 'red',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    marginRight: '0.7rem',
};

export default Navbar;