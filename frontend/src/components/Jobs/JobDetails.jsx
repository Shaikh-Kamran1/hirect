import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import AnimatedSection from '../common/AnimatedSection';
import { formatSalaryINR } from '../../utils/formatters';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSeeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setApplying(true);
    try {
      await applicationService.applyForJob(id, null, coverLetter);
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      navigate('/my-applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!job) return null;

  return (
    <div className="container mt-4">
      <motion.button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate('/jobs')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Jobs
      </motion.button>

      <AnimatedSection animation="fadeUp">
        <div className="card-modern shadow-lg">
          <div className="card-body">
            <div className="job-details-hero">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <motion.h2
                    className="gradient-text mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {job.title}
                  </motion.h2>
                  <motion.h4
                    className="text-muted mb-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {job.company}
                  </motion.h4>
                </div>
                <motion.span
                  className={`badge ${job.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}
                  style={{ fontSize: '0.95rem', padding: '0.6rem 1rem' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  {job.status}
                </motion.span>
              </div>

              <motion.div
                className="job-info-badges"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {job.location && <span className="badge bg-primary" style={{ color: 'white' }}>📍 {job.location}</span>}
                {job.jobType && <span className="badge bg-info" style={{ color: 'white' }}>📋 {job.jobType}</span>}
                {job.experienceLevel && <span className="badge bg-warning" style={{ color: 'white' }}>📈 {job.experienceLevel}</span>}
                {job.salaryRange && <span className="badge bg-success" style={{ color: 'white' }}>{formatSalaryINR(job.salaryRange)}</span>}
              </motion.div>
            </div>

            <motion.div
              className="description-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h5>Description</h5>
              <p style={{ color: 'var(--text-primary)' }}>{job.description}</p>
            </motion.div>

            {job.requirements && (
              <motion.div
                className="requirements-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h5>Requirements</h5>
                <p style={{ color: 'var(--text-primary)' }}>{job.requirements}</p>
              </motion.div>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <small className="text-muted">
                Posted by {job.recruiterName} | {job.applicationCount || 0} applicant(s)
              </small>
            </div>

            {user && isSeeker() && job.status === 'ACTIVE' && (
              <div className="mt-4">
                <AnimatePresence mode="wait">
                  {!showApplyForm ? (
                    <motion.button
                      key="apply-button"
                      className="btn btn-primary-gradient btn-lg"
                      onClick={() => setShowApplyForm(true)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply Now →
                    </motion.button>
                  ) : (
                    <motion.div
                      key="apply-form"
                      className="card-modern border-primary"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <div className="card-body">
                        <h5>Apply for this position</h5>
                        <form onSubmit={handleApply}>
                          <div className="mb-3">
                            <label className="form-label">Cover Letter</label>
                            <textarea
                              className="form-control"
                              rows="4"
                              value={coverLetter}
                              onChange={e => setCoverLetter(e.target.value)}
                              placeholder="Tell us why you're a great fit..."
                            />
                          </div>
                          <div className="d-flex gap-2">
                            <motion.button
                              type="submit"
                              className="btn btn-primary-gradient"
                              disabled={applying}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {applying ? 'Submitting...' : 'Submit Application'}
                            </motion.button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowApplyForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!user && (
              <div className="mt-4">
                <motion.button
                  className="btn btn-primary-gradient btn-lg"
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login to Apply
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default JobDetails;
