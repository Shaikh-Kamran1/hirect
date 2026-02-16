import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import jobService from '../../services/jobService';
import AnimatedSection from '../common/AnimatedSection';
import { formatSalaryINR } from '../../utils/formatters';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ title: '', location: '', company: '' });

  const fetchJobs = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await jobService.getAllJobs(filters);
      setJobs(data);
    } catch (err) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (search.title) filters.title = search.title;
    if (search.location) filters.location = search.location;
    if (search.company) filters.company = search.company;
    fetchJobs(filters);
  };

  const clearSearch = () => {
    setSearch({ title: '', location: '', company: '' });
    fetchJobs();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mt-4">
      <AnimatedSection animation="fadeUp">
        <motion.h2 className="mb-4 gradient-text">Browse Jobs</motion.h2>
      </AnimatedSection>

      <div className="card-modern mb-4 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Job Title</label>
              <input type="text" className="form-control" placeholder="e.g. Java Developer"
                value={search.title} onChange={e => setSearch({...search, title: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" placeholder="e.g. Bangalore, Mumbai, Delhi"
                value={search.location} onChange={e => setSearch({...search, location: e.target.value})} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Company</label>
              <input type="text" className="form-control" placeholder="e.g. Tech Corp"
                value={search.company} onChange={e => setSearch({...search, company: e.target.value})} />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <motion.button
                type="submit"
                className="btn btn-primary-gradient flex-grow-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Search
              </motion.button>
              <button type="button" className="btn btn-outline-secondary" onClick={clearSearch}>Clear</button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : jobs.length === 0 ? (
        <div className="alert alert-info">No jobs found. Try adjusting your search.</div>
      ) : (
        <motion.div
          className="row"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {jobs.map(job => (
            <motion.div
              key={job.id}
              className="col-md-6 mb-4"
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="card job-card h-100 shadow-sm">
                <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
                  <h5 className="card-title mb-2" style={{ lineHeight: '1.4' }}>{job.title}</h5>
                  <h6 className="text-muted mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{job.company}</h6>

                  <p className="mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    📍 {job.location}
                  </p>

                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {job.jobType && <span className="badge bg-primary" style={{ color: 'white', padding: '0.4rem 0.8rem' }}>{job.jobType}</span>}
                    {job.experienceLevel && <span className="badge bg-info" style={{ color: 'white', padding: '0.4rem 0.8rem' }}>{job.experienceLevel}</span>}
                    {job.salaryRange && <span className="badge bg-success" style={{ color: 'white', padding: '0.4rem 0.8rem' }}>{formatSalaryINR(job.salaryRange)}</span>}
                  </div>

                  <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
                    {job.description?.substring(0, 120)}{job.description?.length > 120 ? '...' : ''}
                  </p>

                  <div className="d-flex justify-content-between align-items-center" style={{ marginTop: 'auto' }}>
                    <small className="text-muted" style={{ fontSize: '0.85rem' }}>{job.applicationCount || 0} applicant(s)</small>
                    <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.8rem' }}>View Details</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default JobList;
