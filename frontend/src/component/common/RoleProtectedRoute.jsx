import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/apiHelper';
import RoleRequired from './RoleRequired';

const RoleProtectedRoute = ({ children, requireRole = true }) => {
  const user = getCurrentUser();
  
  // If no user is logged in, redirect to login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is required but user doesn't have one, show role selection
  if (requireRole && (!user.role || user.role === '')) {
    return <RoleRequired />;
  }
  
  // If user has a role, render the protected component
  return children;
};

export default RoleProtectedRoute; 