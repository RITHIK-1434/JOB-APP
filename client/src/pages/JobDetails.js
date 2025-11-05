import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock, FaBuilding } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await jobsAPI.getJobById(id);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      alert('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      alert('Only job seekers can apply for jobs');
      return;
    }

    setShowModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setApplying(true);

    try {
      await applicationsAPI.apply({
        jobId: job._id,
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl || undefined
      }, token);

      setSuccess('Application submitted successfully!');
      setTimeout(() => {
        setShowModal(false);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <h3>Job not found</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="job-details-container">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="job-details-card">
                <div className="job-header mb-4">
                  <h1 className="job-title-large">{job.title}</h1>
                  <h4 className="text-primary mb-3">
                    <FaBuilding className="me-2" />
                    {job.company}
                  </h4>
                  
                  <div className="job-meta">
                    <span className="job-meta-item">
                      <FaMapMarkerAlt className="me-2" />
                      {job.location}
                    </span>
                    <span className="job-meta-item">
                      <FaBriefcase className="me-2" />
                      {job.jobType}
                    </span>
                    <span className="job-meta-item">
                      <FaDollarSign className="me-2" />
                      {job.salary}
                    </span>
                    <span className="job-meta-item">
                      <FaClock className="me-2" />
                      Posted {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <div className="job-tags mt-3">
                    <span className="badge bg-primary">{job.category}</span>
                    <span className="badge bg-secondary">{job.experienceLevel}</span>
                    {job.deadline && (
                      <span className="badge bg-warning text-dark">
                        Deadline: {formatDate(job.deadline)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="job-section">
                  <h3 className="section-heading">Job Description</h3>
                  <p className="section-content">{job.description}</p>
                </div>

                <div className="job-section">
                  <h3 className="section-heading">Requirements</h3>
                  <p className="section-content">{job.requirements}</p>
                </div>

                {job.benefits && (
                  <div className="job-section">
                    <h3 className="section-heading">Benefits</h3>
                    <p className="section-content">{job.benefits}</p>
                  </div>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="job-section">
                    <h3 className="section-heading">Required Skills</h3>
                    <div className="skills-container">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="job-apply-card sticky-top">
                <h4 className="mb-3">Apply for this job</h4>
                <p className="text-muted mb-4">
                  Submit your application and we'll get back to you soon.
                </p>
                
                <button 
                  className="btn btn-primary w-100 py-3 fw-semibold"
                  onClick={handleApplyClick}
                >
                  Apply Now
                </button>

                <div className="job-info-box mt-4">
                  <h5 className="mb-3">Job Details</h5>
                  <div className="info-item">
                    <strong>Job Type:</strong>
                    <span>{job.jobType}</span>
                  </div>
                  <div className="info-item">
                    <strong>Experience:</strong>
                    <span>{job.experienceLevel}</span>
                  </div>
                  <div className="info-item">
                    <strong>Category:</strong>
                    <span>{job.category}</span>
                  </div>
                  <div className="info-item">
                    <strong>Salary:</strong>
                    <span>{job.salary}</span>
                  </div>
                  {job.postedBy && (
                    <>
                      <div className="info-item">
                        <strong>Contact:</strong>
                        <span>{job.postedBy.email}</span>
                      </div>
                      {job.postedBy.phone && (
                        <div className="info-item">
                          <strong>Phone:</strong>
                          <span>{job.postedBy.phone}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for {job.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

          <form onSubmit={handleApplicationSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Cover Letter *</label>
              <textarea
                className="form-control"
                rows="8"
                placeholder="Tell the employer why you're the perfect fit for this role..."
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({
                  ...applicationData,
                  coverLetter: e.target.value
                })}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Resume URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/resume.pdf"
                value={applicationData.resumeUrl}
                onChange={(e) => setApplicationData({
                  ...applicationData,
                  resumeUrl: e.target.value
                })}
              />
              <small className="text-muted">
                Provide a link to your online resume or portfolio
              </small>
            </div>

            <div className="d-grid">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                disabled={applying}
              >
                {applying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default JobDetails;