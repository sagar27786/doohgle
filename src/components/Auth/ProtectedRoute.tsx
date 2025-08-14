import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // User not logged in
    return <Navigate to="/auth/login" replace />;
  }

  const hasRequiredRole = currentUser.roles && currentUser.roles.some((role: string) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    // User does not have the required role
    return <Navigate to="/" replace />; // Or to an unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
