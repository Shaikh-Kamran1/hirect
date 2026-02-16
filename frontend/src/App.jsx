import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import JobList from './components/Jobs/JobList';
import JobDetails from './components/Jobs/JobDetails';
import PostJob from './components/Jobs/PostJob';
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard';
import MyApplications from './components/JobSeeker/MyApplications';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/jobs" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/post-job" element={
        <ProtectedRoute requiredRole="RECRUITER"><PostJob /></ProtectedRoute>
      } />
      <Route path="/recruiter" element={
        <ProtectedRoute requiredRole="RECRUITER"><RecruiterDashboard /></ProtectedRoute>
      } />
      <Route path="/my-applications" element={
        <ProtectedRoute requiredRole="JOB_SEEKER"><MyApplications /></ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/jobs" />} />
    </Routes>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <AppRoutes />
          </main>
          <footer style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="text-center border-top py-3 mt-4">
            <small style={{ color: 'var(--text-secondary)' }}>Hirect &copy; 2024. All rights reserved.</small>
          </footer>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme={theme} />
      </AuthProvider>
    </Router>
  );
}

export default App;
