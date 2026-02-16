import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jobService from '../../services/jobService';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '',
    jobType: 'FULL_TIME', experienceLevel: 'MID', salaryRange: '', requirements: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobService.createJob(form);
      toast.success('Job posted successfully!');
      navigate('/recruiter');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 gradient-text">Post a New Job</h2>
      <div className="card-modern shadow-lg">
        <div className="card-body" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Job Title *</label>
                <input type="text" className="form-control" name="title" value={form.title}
                  onChange={handleChange} required placeholder="e.g. Senior Java Developer" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Company *</label>
                <input type="text" className="form-control" name="company" value={form.company}
                  onChange={handleChange} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Location *</label>
                <input type="text" className="form-control" name="location" value={form.location}
                  onChange={handleChange} required placeholder="e.g. Bangalore, Mumbai, Delhi" />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Job Type</label>
                <select className="form-select" name="jobType" value={form.jobType} onChange={handleChange}>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Experience Level</label>
                <select className="form-select" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
                  <option value="ENTRY">Entry Level</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Salary Range</label>
              <input type="text" className="form-control" name="salaryRange" value={form.salaryRange}
                onChange={handleChange} placeholder="e.g. 800000-1200000 (in ₹)" />
            </div>
            <div className="mb-3">
              <label className="form-label">Description *</label>
              <textarea className="form-control" name="description" rows="4" value={form.description}
                onChange={handleChange} required placeholder="Describe the job role and responsibilities..." />
            </div>
            <div className="mb-3">
              <label className="form-label">Requirements</label>
              <textarea className="form-control" name="requirements" rows="3" value={form.requirements}
                onChange={handleChange} placeholder="List required skills and qualifications..." />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary-gradient" disabled={loading} style={{ padding: '0.75rem 1.5rem' }}>
                {loading ? 'Posting...' : 'Post Job'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/recruiter')} style={{ padding: '0.75rem 1.5rem', borderColor: 'var(--text-primary)', color: 'var(--text-primary)' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
