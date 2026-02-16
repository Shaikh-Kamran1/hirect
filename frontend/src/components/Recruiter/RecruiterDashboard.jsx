import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import AnimatedSection from '../common/AnimatedSection';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getMyJobs();
        setJobs(data);
      } catch (err) {
        toast.error('Failed to load your jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const viewApplications = async (job) => {
    setSelectedJob(job);
    try {
      const data = await applicationService.getJobApplications(job.id);
      setApplications(data);
    } catch (err) {
      toast.error('Failed to load applications');
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await applicationService.updateApplicationStatus(appId, status);
      toast.success(`Application ${status.toLowerCase()}`);
      if (selectedJob) viewApplications(selectedJob);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await jobService.deleteJob(jobId);
      toast.success('Job deleted');
      setJobs(jobs.filter(j => j.id !== jobId));
      if (selectedJob?.id === jobId) { setSelectedJob(null); setApplications([]); }
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <AnimatedSection animation="fadeUp">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <motion.h2 className="gradient-text">My Posted Jobs</motion.h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/post-job" className="btn btn-primary-gradient">+ Post New Job</Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {jobs.length === 0 ? (
        <div className="alert alert-info">
          You haven't posted any jobs yet. <Link to="/post-job">Post your first job</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card-modern mb-2 cursor-pointer ${selectedJob?.id === job.id ? 'border border-primary' : ''}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => viewApplications(job)}
                  whileHover={{ scale: 1.02, boxShadow: 'var(--card-hover-shadow)' }}
                >
                  <div className="card-body py-3" style={{ padding: '1rem 1.5rem' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div style={{ flex: 1 }}>
                        <h6 className="mb-2" style={{ fontSize: '1rem', lineHeight: '1.4', marginTop: 0 }}>{job.title}</h6>
                        <small className="text-muted" style={{ lineHeight: '1.5', fontSize: '0.85rem' }}>{job.location} | {job.applicationCount || 0} applicants</small>
                      </div>
                      <div className="d-flex gap-1" style={{ marginLeft: '1rem' }}>
                        <motion.button
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="col-md-7">
            <AnimatePresence mode="wait">
              {selectedJob ? (
                <motion.div
                  key="selected-job"
                  className="card-modern shadow-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="card-header">
                    <h5 style={{ margin: 0, color: 'white' }}>Applications for: {selectedJob.title}</h5>
                  </div>
                  <div className="card-body" style={{ padding: '1.5rem' }}>
                    {applications.length === 0 ? (
                      <p className="text-muted">No applications yet.</p>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                      >
                        {applications.map((app, index) => (
                          <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card-modern rounded mb-3"
                            style={{ padding: '1.5rem', background: 'var(--bg-secondary)' }}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div style={{ flex: 1, paddingRight: '1rem' }}>
                                <strong style={{ fontSize: '1.1rem', lineHeight: '1.5', color: 'var(--text-primary)', display: 'block' }}>{app.applicantName}</strong>
                                <small style={{ lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>{app.applicantEmail}</small>
                                {app.coverLetter && (
                                  <p className="mb-0 mt-3" style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Cover Letter:</strong><br/>
                                    {app.coverLetter}
                                  </p>
                                )}
                              </div>
                              <span className={`badge ${app.status === 'PENDING' ? 'bg-warning text-dark' : app.status === 'ACCEPTED' ? 'bg-success' : 'bg-danger'}`} style={{ padding: '0.6rem 1rem', whiteSpace: 'nowrap', fontSize: '0.9rem', marginLeft: '1rem' }}>
                                {app.status}
                              </span>
                            </div>
                            {app.status === 'PENDING' && (
                              <motion.div
                                className="d-flex gap-2 mt-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <motion.button
                                  className="btn btn-success btn-sm"
                                  onClick={() => updateStatus(app.id, 'ACCEPTED')}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                >
                                  Accept
                                </motion.button>
                                <motion.button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => updateStatus(app.id, 'REJECTED')}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                >
                                  Reject
                                </motion.button>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-selection"
                  className="text-center text-muted mt-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p>Click a job on the left to view its applications</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
