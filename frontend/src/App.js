// src/App.js

import React from 'react'; // Import React
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Context Provider and Hook
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth hook

// Import Layout and Routing Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/routing/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Import Page Components (ensure all these exist)
import LoginPage from './pages/auth/LoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import TeacherRegisterPage from './pages/auth/TeacherRegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApproveTeachers from './pages/admin/ApproveTeachers';
import ApproveCourses from './pages/admin/ApproveCourses';
import ApproveReviews from './pages/admin/ApproveReviews';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateCoursePage from './pages/teacher/CreateCoursePage';
import MyCoursesPage from './pages/teacher/MyCoursesPage';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseListPage from './pages/student/CourseListPage';
import CourseDetailPage from './pages/student/CourseDetailPage';
import MyReviewsPage from './pages/student/MyReviewsPage';
import ProfilePage from './pages/common/ProfilePage';
import NotFoundPage from './pages/common/NotFoundPage';

import './App.css';

// Inner component to access context after Provider
function AppContent() {
  const { loading: authLoading } = useAuth(); // Get loading state from context

  // Show a global loading spinner during the initial auth check
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Once loading is false, render the routes
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/student" element={<StudentRegisterPage />} />
      <Route path="/register/teacher" element={<TeacherRegisterPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/approve/teachers" element={<ProtectedRoute roles={['admin']}><ApproveTeachers /></ProtectedRoute>} />
      <Route path="/admin/approve/courses" element={<ProtectedRoute roles={['admin']}><ApproveCourses /></ProtectedRoute>} />
      <Route path="/admin/approve/reviews" element={<ProtectedRoute roles={['admin']}><ApproveReviews /></ProtectedRoute>} />

      {/* Protected Teacher Routes */}
      <Route path="/teacher/dashboard" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/courses/my" element={<ProtectedRoute roles={['teacher']}><MyCoursesPage /></ProtectedRoute>} />
      <Route path="/teacher/courses/create" element={<ProtectedRoute roles={['teacher']} requireApproved={true}><CreateCoursePage /></ProtectedRoute>} />

      {/* Protected Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute roles={['student', 'teacher', 'admin']}><CourseListPage /></ProtectedRoute>} />
      <Route path="/courses/:courseId" element={<ProtectedRoute roles={['student', 'teacher', 'admin']}><CourseDetailPage /></ProtectedRoute>} />
      <Route path="/my-reviews" element={<ProtectedRoute roles={['student']}><MyReviewsPage /></ProtectedRoute>} />

      {/* Common Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute roles={['admin', 'teacher', 'student']}><ProfilePage /></ProtectedRoute>} />

      {/* Root & Not Found Routes */}
      {/* LoginPage handles redirection if user is already logged in */}
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}


function App() {
  return (
    // AuthProvider wraps everything
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container" style={{ paddingTop: '70px', paddingBottom: '20px' }}>
          {/* Render AppContent which checks loading state */}
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;