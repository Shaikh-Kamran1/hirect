import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import applicationService from '../../services/applicationService';
import AnimatedSection from '../common/AnimatedSection';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getMyApplications();
      setApplications(data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const withdrawApplication = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await applicationService.withdrawApplication(id);
      toast.success('Application withdrawn');
      setApplications(applications.filter(a => a.id !== id));
    } catch (err) {
      toast.error('Failed to withdraw application');
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      PENDING: 'bg-warning text-dark',
      ACCEPTED: 'bg-success',
      REJECTED: 'bg-danger',
      WITHDRAWN: 'bg-secondary'
    };
    return classes[status] || 'bg-secondary';
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <AnimatedSection animation="fadeUp">
        <motion.h2 className="mb-4 gradient-text">My Applications</motion.h2>
      </AnimatedSection>

      {applications.length === 0 ? (
        <div className="alert alert-info">
          You haven't applied to any jobs yet. <Link to="/jobs">Browse jobs</Link>
        </div>
      ) : (
        <motion.div
          className="table-responsive"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Cover Letter</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>
                    <Link to={`/jobs/${app.jobId}`} className="text-decoration-none fw-bold" style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                      {app.jobTitle}
                    </Link>
                  </td>
                  <td style={{maxWidth: '300px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {app.coverLetter ? (app.coverLetter.substring(0, 80) + (app.coverLetter.length > 80 ? '...' : '')) : '-'}
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(app.status)}`} style={{ padding: '0.5rem 0.75rem' }}>{app.status}</span>
                  </td>
                  <td>
                    {app.status === 'PENDING' && (
                      <motion.button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => withdrawApplication(app.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Withdraw
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default MyApplications;
