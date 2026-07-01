import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

/**
 * Route protection wrapper component.
 * Redirects unauthenticated users to login page, and validates roles.
 * 
 * @param {React.ReactNode} children - The protected page component.
 * @param {Array<string>} allowedRoles - Roles permitted to view this route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // If loading user credentials, render luxury spinner
  if (loading) {
    return <Loader />;
  }

  // Redirect to login if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, redirect to home or their appropriate dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallbackPath = user.role === 'admin' 
      ? '/admin' 
      : user.role === 'organizer' 
        ? '/organizer' 
        : '/dashboard';
        
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
