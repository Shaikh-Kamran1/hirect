import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import AnimatedSection from '../common/AnimatedSection';

const Register = () => {
  const [form, setForm] = useState({
    email: '', fullName: '', password: '', role: 'JOB_SEEKER', companyName: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form.email, form.fullName, form.password, form.role, form.companyName, form.phone);
      toast.success('Registration successful!');
      navigate(data.role === 'RECRUITER' ? '/recruiter' : '/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <AnimatedSection animation="fadeUp">
            <div className="card-modern shadow-lg">
              <div className="card-body p-4">
                <motion.h3
                  className="text-center mb-4 gradient-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Create Account
                </motion.h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">I am a</label>
                    <motion.select
                      className="form-select"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <option value="JOB_SEEKER">Job Seeker</option>
                      <option value="RECRUITER">Recruiter</option>
                    </motion.select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <motion.input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      minLength={2}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <motion.input
                      type="email"
                      className="form-control"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <motion.input
                      type="password"
                      className="form-control"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <motion.input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    />
                  </div>
                  {form.role === 'RECRUITER' && (
                    <motion.div
                      className="mb-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        required
                      />
                    </motion.div>
                  )}
                  <motion.button
                    type="submit"
                    className="btn btn-primary-gradient w-100"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Creating account...' : 'Register'}
                  </motion.button>
                </form>
                <p className="text-center mt-3 mb-0">
                  Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Login here</Link>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Register;
