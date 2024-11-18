// File: src/components/auth/protected_route.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/use_auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user || !requiredRole.includes(user.role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
