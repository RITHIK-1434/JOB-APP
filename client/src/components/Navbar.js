import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBriefcase, FaUser, FaSignOutAlt, FaPlusCircle, FaStar } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-gradient sticky-top">
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">
          <FaStar className="me-2" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          Jobify
          <FaStar className="ms-2" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ borderColor: 'white' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/dashboard">
                    <FaUser className="me-1" />
                    Dashboard
                  </Link>
                </li>
                
                {user?.role === 'employer' && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/post-job">
                      <FaPlusCircle className="me-1" />
                      Post Job
                    </Link>
                  </li>
                )}
                
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm ms-2" 
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm ms-2" to="/register" style={{
                    fontWeight: '600',
                    borderRadius: '20px',
                    padding: '0.5rem 1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
                  }}>
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;