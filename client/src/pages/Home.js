import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { jobsAPI } from '../utils/api';
import { FaSearch, FaMapMarkerAlt, FaLightbulb, FaBolt, FaBriefcase, FaBullseye, FaRocket, FaStar } from 'react-icons/fa';

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
      
      {/* Hero Section with Jobify Branding */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            ✨ Jobify ✨
          </h1>
          <p className="hero-subtitle">
            Your Gateway to Endless Career Opportunities - Connect, Apply, and Succeed
          </p>
          
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
              <FaSearch className="me-2" />
              Search Jobs
            </button>
          </form>

          {/* Stats Section */}
          <div className="row mt-5 text-center">
            <div className="col-md-4 mb-3">
              <div className="hero-stat">
                <FaBriefcase className="hero-stat-icon" />
                <h3 className="hero-stat-number">{jobs.length}+</h3>
                <p className="hero-stat-label">Active Jobs</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="hero-stat">
                <FaRocket className="hero-stat-icon" />
                <h3 className="hero-stat-number">500+</h3>
                <p className="hero-stat-label">Companies</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="hero-stat">
                <FaStar className="hero-stat-icon" />
                <h3 className="hero-stat-number">1000+</h3>
                <p className="hero-stat-label">Success Stories</p>
              </div>
            </div>
          </div>
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
              <p className="mt-3 text-muted">Loading amazing opportunities...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="no-jobs-found">
                <FaSearch className="no-jobs-icon" />
                <h3>No jobs found</h3>
                <p className="text-muted">Try adjusting your filters or search terms</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Jobify?</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaLightbulb />
                </div>
                <h4>Smart Matching</h4>
                <p>AI-powered job recommendations tailored to your profile and preferences</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaBolt />
                </div>
                <h4>Quick Apply</h4>
                <p>Apply to multiple positions with just a few clicks and track your progress</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaBriefcase />
                </div>
                <h4>Top Companies</h4>
                <p>Access exclusive opportunities from leading employers worldwide</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <FaBullseye />
                </div>
                <h4>Career Growth</h4>
                <p>Resources and guidance to help you advance your professional journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">Join thousands of professionals who found their dream jobs through Jobify</p>
          <div className="cta-buttons">
            <a href="/register" className="btn btn-cta btn-cta-primary">
              Get Started Free
              <FaRocket className="ms-2" />
            </a>
            <a href="/login" className="btn btn-cta btn-cta-secondary">
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 Jobify - Your Career Partner. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .hero-stat {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .hero-stat:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .hero-stat-icon {
          font-size: 3rem;
          color: white;
          margin-bottom: 1rem;
        }

        .hero-stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }

        .hero-stat-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          font-weight: 500;
          margin: 0;
        }

        .no-jobs-found {
          padding: 4rem 2rem;
        }

        .no-jobs-icon {
          font-size: 5rem;
          color: #cbd5e1;
          margin-bottom: 2rem;
        }

        .no-jobs-found h3 {
          color: var(--text-dark);
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 6rem 0;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        }

        .cta-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }

        .cta-subtitle {
          font-size: 1.3rem;
          margin-bottom: 3rem;
          opacity: 0.95;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta {
          padding: 1rem 3rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .btn-cta-primary {
          background: white;
          color: #667eea;
        }

        .btn-cta-primary:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          color: #667eea;
        }

        .btn-cta-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-cta-secondary:hover {
          background: white;
          color: #667eea;
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .cta-title {
            font-size: 2rem;
          }

          .cta-subtitle {
            font-size: 1.1rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn-cta {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default Home;