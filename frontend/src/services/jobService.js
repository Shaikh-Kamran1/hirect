import api from './api';

const jobService = {
  getAllJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.location) params.append('location', filters.location);
    if (filters.company) params.append('company', filters.company);
    if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);

    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    const response = await api.get(url);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  getMyJobs: async () => {
    const response = await api.get('/jobs/my-jobs');
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    await api.delete(`/jobs/${id}`);
  },
};

export default jobService;
