import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
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
            <div className="col-md-6 col-lg-5">
              <div className="auth-card">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Login to your account</p>
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

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary fw-semibold">
                      Register here
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

export default Login;