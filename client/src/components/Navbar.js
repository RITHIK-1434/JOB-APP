import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBriefcase, FaUser, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';

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
          <FaBriefcase className="me-2" />
          JobPortal
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
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
                  <Link className="btn btn-light btn-sm ms-2" to="/register">
                    Register
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