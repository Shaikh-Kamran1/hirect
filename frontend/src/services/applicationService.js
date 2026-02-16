import api from './api';

const applicationService = {
  applyForJob: async (jobId, resumePath, coverLetter) => {
    const response = await api.post('/applications', null, {
      params: {
        jobId,
        resumePath,
        coverLetter,
      },
    });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status) => {
    const response = await api.patch(`/applications/${id}/status`, {
      status,
    });
    return response.data;
  },

  withdrawApplication: async (id) => {
    await api.delete(`/applications/${id}`);
  },
};

export default applicationService;
