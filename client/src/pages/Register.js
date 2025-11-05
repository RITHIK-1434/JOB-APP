import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaUserTie } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    company: ''
  });
  
  const [error, setError] = useState('');
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
    
    if (!formData.role) {
      setError('Please select your role');
      return;
    }

    if (formData.role === 'employer' && !formData.company) {
      setError('Please enter your company name');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-6">
              <div className="auth-card">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted">Join our platform today</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                    </div>
                    <small className="text-muted">Minimum 6 characters</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">I am a:</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUserTie />
                      </span>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select your role</option>
                        <option value="jobseeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                      </select>
                    </div>
                  </div>

                  {formData.role === 'employer' && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Company Name</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaBuilding />
                        </span>
                        <input
                          type="text"
                          name="company"
                          className="form-control"
                          placeholder="Enter your company name"
                          value={formData.company}
                          onChange={handleChange}
                          required={formData.role === 'employer'}
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 fw-semibold mt-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating account...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;