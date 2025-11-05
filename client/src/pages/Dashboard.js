import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { FaBriefcase, FaUsers, FaCheckCircle, FaClock, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'employer') {
      loadEmployerData();
    } else {
      loadJobseekerData();
    }
  }, [user]);

  const loadEmployerData = async () => {
    try {
      const response = await jobsAPI.getMyJobs(token);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJobseekerData = async () => {
    try {
      const response = await applicationsAPI.getMyApplications(token);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewApplications = async (job) => {
    try {
      const response = await applicationsAPI.getJobApplications(job._id, token);
      setJobApplications(response.data.applications);
      setSelectedJob(job);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Error loading applications');
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await applicationsAPI.updateApplicationStatus(appId, status, token);
      alert('Application status updated successfully');
      // Reload applications
      const response = await applicationsAPI.getJobApplications(selectedJob._id, token);
      setJobApplications(response.data.applications);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.deleteJob(jobId, token);
        alert('Job deleted successfully');
        loadEmployerData();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
      }
    }
  };

  const withdrawApplication = async (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationsAPI.deleteApplication(appId, token);
        alert('Application withdrawn successfully');
        loadJobseekerData();
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert('Error withdrawing application');
      }
    }
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

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="container py-5">
          <div className="dashboard-header mb-4">
            <h1 className="fw-bold">Welcome, {user?.name}!</h1>
            <p className="text-muted">
              {user?.role === 'employer' ? 'Employer Account' : 'Job Seeker Account'}
            </p>
          </div>

          {user?.role === 'employer' ? (
            <>
              {/* Employer Stats */}
              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaBriefcase />
                    </div>
                    <h3>{jobs.length}</h3>
                    <p>Jobs Posted</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaCheckCircle />
                    </div>
                    <h3>{jobs.filter(j => j.status === 'active').length}</h3>
                    <p>Active Jobs</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaUsers />
                    </div>
                    <h3>{jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0)}</h3>
                    <p>Total Applications</p>
                  </div>
                </div>
              </div>

              {/* Posted Jobs */}
              <div className="content-card">
                <h2 className="mb-4">Your Posted Jobs</h2>
                {jobs.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No jobs posted yet.</p>
                  </div>
                ) : (
                  <div className="jobs-list">
                    {jobs.map(job => (
                      <div key={job._id} className="job-item">
                        <div className="job-item-header">
                          <div>
                            <h4 className="job-item-title">{job.title}</h4>
                            <div className="job-item-info">
                              <span>📍 {job.location}</span>
                              <span>💼 {job.jobType}</span>
                              <span>💰 {job.salary}</span>
                              <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`badge ${job.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="job-item-info mt-2">
                          <span>📊 {job.applicants?.length || 0} applicant(s)</span>
                          <span>Category: {job.category}</span>
                          <span>Level: {job.experienceLevel}</span>
                        </div>
                        <div className="job-item-actions mt-3">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => viewApplications(job)}
                          >
                            <FaEye className="me-1" />
                            View Applications ({job.applicants?.length || 0})
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteJob(job._id)}
                          >
                            <FaTrash className="me-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Jobseeker Stats */}
              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaBriefcase />
                    </div>
                    <h3>{applications.length}</h3>
                    <p>Applications Sent</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaClock />
                    </div>
                    <h3>{applications.filter(a => a.status === 'pending').length}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaCheckCircle />
                    </div>
                    <h3>{applications.filter(a => a.status === 'shortlisted').length}</h3>
                    <p>Shortlisted</p>
                  </div>
                </div>
              </div>

              {/* Applications */}
              <div className="content-card">
                <h2 className="mb-4">Your Applications</h2>
                {applications.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No applications yet. Start applying to jobs!</p>
                  </div>
                ) : (
                  <div className="applications-list">
                    {applications.map(app => (
                      <div key={app._id} className="application-item">
                        <div className="application-header">
                          <div>
                            <h4 className="application-title">{app.job?.title}</h4>
                            <p className="text-muted mb-1">{app.job?.company}</p>
                            <div className="application-info">
                              <span>📍 {app.job?.location}</span>
                              <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="mt-3">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => withdrawApplication(app._id)}
                          >
                            <FaTrash className="me-1" />
                            Withdraw Application
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Applications Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Applications for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {jobApplications.length === 0 ? (
            <p className="text-center text-muted">No applications yet.</p>
          ) : (
            jobApplications.map(app => (
              <div key={app._id} className="application-card mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="mb-1">{app.applicant?.name}</h5>
                    <p className="text-muted mb-1">📧 {app.applicant?.email}</p>
                    {app.applicant?.phone && <p className="text-muted mb-1">📱 {app.applicant?.phone}</p>}
                    <p className="text-muted mb-0">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                {app.resumeUrl && (
                  <p>
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                      📄 View Resume
                    </a>
                  </p>
                )}
                <div className="cover-letter-box">
                  <strong>Cover Letter:</strong>
                  <p className="mt-2">{app.coverLetter}</p>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="me-2"
                    onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                  >
                    Shortlist
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => updateApplicationStatus(app._id, 'rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

const getStatusBadgeClass = (status) => {
  switch(status) {
    case 'pending': return 'bg-warning';
    case 'reviewed': return 'bg-info';
    case 'shortlisted': return 'bg-success';
    case 'rejected': return 'bg-danger';
    case 'accepted': return 'bg-primary';
    default: return 'bg-secondary';
  }
};

export default Dashboard;