import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
const PrivateAdminRoute = ({children }) => {
    const {isAuthenticated } = useAdminAuth()

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/Login" />
  );
};

export default PrivateAdminRoute;
