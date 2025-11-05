import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign, FaClock } from 'react-icons/fa';

const JobCard = ({ job }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company text-primary fw-bold">{job.company}</p>
      </div>
      
      <div className="job-details">
        <span className="job-detail">
          <FaMapMarkerAlt className="me-1" />
          {job.location}
        </span>
        <span className="job-detail">
          <FaBriefcase className="me-1" />
          {job.jobType}
        </span>
        <span className="job-detail">
          <FaDollarSign className="me-1" />
          {job.salary}
        </span>
      </div>
      
      <div className="job-tags">
        <span className="badge bg-light text-primary">{job.category}</span>
        <span className="badge bg-light text-primary">{job.experienceLevel}</span>
      </div>
      
      <p className="job-description">
        {job.description.substring(0, 150)}...
      </p>
      
      <div className="job-footer">
        <small className="text-muted">
          <FaClock className="me-1" />
          Posted {formatDate(job.createdAt)}
        </small>
        <Link to={`/job/${job._id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;