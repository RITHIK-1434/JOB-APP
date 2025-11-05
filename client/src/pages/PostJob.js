import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobsAPI } from '../utils/api';
import Navbar from '../components/Navbar';

const PostJob = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    salary: '',
    experienceLevel: '',
    category: '',
    deadline: '',
    skills: '',
    description: '',
    requirements: '',
    benefits: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await jobsAPI.createJob(formData, token);
      setSuccess('Job posted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="post-job-container">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="post-job-card">
                <h2 className="fw-bold mb-2">Post a New Job</h2>
                <p className="text-muted mb-4">Fill in the details to post your job listing</p>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-dismissible fade show">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Job Title *</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="e.g. Senior Software Engineer"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Company Name *</label>
                      <input
                        type="text"
                        name="company"
                        className="form-control"
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Location *</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Job Type *</label>
                      <select
                        name="jobType"
                        className="form-select"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select job type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Salary Range *</label>
                      <input
                        type="text"
                        name="salary"
                        className="form-control"
                        placeholder="e.g. $80,000 - $100,000"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Experience Level *</label>
                      <select
                        name="experienceLevel"
                        className="form-select"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select level</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category *</label>
                      <select
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Application Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        className="form-control"
                        value={formData.deadline}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Required Skills (comma separated)</label>
                      <input
                        type="text"
                        name="skills"
                        className="form-control"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={formData.skills}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Job Description *</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="6"
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Requirements *</label>
                      <textarea
                        name="requirements"
                        className="form-control"
                        rows="5"
                        placeholder="List the qualifications and requirements..."
                        value={formData.requirements}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Benefits</label>
                      <textarea
                        name="benefits"
                        className="form-control"
                        rows="4"
                        placeholder="What benefits do you offer?"
                        value={formData.benefits}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Posting Job...
                          </>
                        ) : (
                          'Post Job'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostJob;