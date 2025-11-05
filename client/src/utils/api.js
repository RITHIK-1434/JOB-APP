import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Set default base URL
axios.defaults.baseURL = API_URL;

// Auth API
export const authAPI = {
  register: (userData) => axios.post('/auth/register', userData),
  login: (credentials) => axios.post('/auth/login', credentials),
  getMe: (token) => axios.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Jobs API
export const jobsAPI = {
  getAllJobs: (filters) => axios.get('/jobs', { params: filters }),
  getJobById: (id) => axios.get(`/jobs/${id}`),
  createJob: (jobData, token) => axios.post('/jobs', jobData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateJob: (id, jobData, token) => axios.put(`/jobs/${id}`, jobData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  deleteJob: (id, token) => axios.delete(`/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getMyJobs: (token) => axios.get('/jobs/my/posted', {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Applications API
export const applicationsAPI = {
  apply: (applicationData, token) => axios.post('/applications', applicationData, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getMyApplications: (token) => axios.get('/applications/my', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getJobApplications: (jobId, token) => axios.get(`/applications/job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateApplicationStatus: (id, status, token) => axios.put(`/applications/${id}/status`, 
    { status }, 
    { headers: { Authorization: `Bearer ${token}` } }
  ),
  deleteApplication: (id, token) => axios.delete(`/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export default axios;