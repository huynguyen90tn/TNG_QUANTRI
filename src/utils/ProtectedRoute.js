// File: src/components/routing/ProtectedRoute.js
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { Center, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner size="xl" />
  </Center>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" state={{ from: location, message: 'Không có quyền truy cập' }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ProtectedRoute;