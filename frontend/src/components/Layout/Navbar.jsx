import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isRecruiter } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div>
          <Link className="navbar-brand fw-bold" to="/">Hirect</Link>
          <small style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.7rem', marginLeft: '0.25rem' }}>Hire Smarter. Hire Direct.</small>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/jobs">Browse Jobs</Link>
            </li>
            {user && isRecruiter() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/recruiter">My Posted Jobs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/post-job">Post a Job</Link>
                </li>
              </>
            )}
            {user && !isRecruiter() && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-applications">My Applications</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav" style={{ gap: '0.75rem' }}>
            <li className="nav-item">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline-secondary btn-sm"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                style={{ borderColor: 'var(--text-primary)', color: 'var(--text-primary)', padding: '0.5rem 0.75rem' }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </motion.button>
            </li>
            {user ? (
              <>
                <li className="nav-item" style={{ marginLeft: '1rem' }}>
                  <span className="nav-link">
                    <span className={`badge ${isRecruiter() ? 'bg-warning text-dark' : 'bg-success'} me-2`}>
                      {isRecruiter() ? 'Recruiter' : 'Job Seeker'}
                    </span>
                    {user.fullName}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout} style={{ borderColor: 'var(--text-primary)', color: 'var(--text-primary)', padding: '0.5rem 0.75rem' }}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item" style={{ marginLeft: '1rem' }}>
                  <Link className="nav-link" to="/login" style={{ fontWeight: '500', padding: '0.5rem 0.75rem' }}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-secondary btn-sm" to="/register" style={{ borderColor: 'var(--text-primary)', color: 'var(--text-primary)', padding: '0.5rem 0.75rem' }}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
