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

  // If allowedRoles includes an empty string (""), treat that as "any authenticated user".
  // This lets users who are authenticated but haven't been assigned roles (yet) access
  // pages like `/auth/select-role`.
  let hasRequiredRole = false;
  if (allowedRoles.includes('')) {
    hasRequiredRole = true;
  } else if (currentUser.roles && Array.isArray(currentUser.roles)) {
    hasRequiredRole = currentUser.roles.some((role: string) => allowedRoles.includes(role));
  }

  if (!hasRequiredRole) {
    // User does not have the required role
    return <Navigate to="/" replace />; // Or to an unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
