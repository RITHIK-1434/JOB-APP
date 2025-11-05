import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, requireEmployer = false }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireEmployer && user?.role !== 'employer') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;