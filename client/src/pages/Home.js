import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { jobsAPI } from '../utils/api';
import { FaSearch, FaMapMarkerAlt, FaLightbulb, FaBolt, FaBriefcase, FaBullseye } from 'react-icons/fa';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    category: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getAllJobs(filters);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs();
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Find Your Dream Job Today</h1>
          <p className="hero-subtitle">Connect with top employers and discover thousands of opportunities</p>
          
          <form onSubmit={handleSearch} className="search-box">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                name="search"
                className="form-control border-start-0 border-end-0"
                placeholder="Job title, keywords, or company"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaMapMarkerAlt />
              </span>
              <input
                type="text"
                name="location"
                className="form-control border-start-0"
                placeholder="City or state"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            
            <button type="submit" className="btn btn-primary px-4">
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Job Type</label>
              <select 
                name="jobType" 
                className="form-select"
                value={filters.jobType}
                onChange={(e) => {
                  handleFilterChange(e);
                  loadJobs();
                }}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label fw-semibold">Experience Level</label>
              <select 
                name="experienceLevel" 
                className="form-select"
                value={filters.experienceLevel}
                onChange={(e) => {
                  handleFilterChange(e);
                  loadJobs();
                }}
              >
                <option value="">All Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label fw-semibold">Category</label>
              <select 
                name="category" 
                className="form-select"
                value={filters.category}
                onChange={(e) => {
                  handleFilterChange(e);
                  loadJobs();
                }}
              >
                <option value="">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section">
        <div className="container">
          <h2 className="section-title">Latest Job Openings</h2>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No jobs found. Try different filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaLightbulb />
                </div>
                <h4>Smart Search</h4>
                <p>Find the perfect job with our advanced search filters</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaBolt />
                </div>
                <h4>Quick Apply</h4>
                <p>Apply to multiple jobs with just one click</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaBriefcase />
                </div>
                <h4>Top Companies</h4>
                <p>Connect with leading employers in your industry</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaBullseye />
                </div>
                <h4>Perfect Match</h4>
                <p>Get personalized job recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;