import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthGateSkeleton } from '../SharedComponents/Shimmer';
import { canAccessPath, firstAdminPath, isFullAdmin } from '../../utils/adminPermissions';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthGateSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/user-panel" replace />;
  }

  const path = location.pathname;
  // Index: if staff has no dashboard, send them to first allowed module
  if ((path === '/admin-panel' || path === '/admin-panel/') && !canAccessPath(user, '/admin-panel')) {
    return <Navigate to={firstAdminPath(user)} replace />;
  }

  if (path.startsWith('/admin-panel') && path !== '/admin-panel' && !canAccessPath(user, path)) {
    // /admin-panel/team only for full admins
    if (path.startsWith('/admin-panel/team') && !isFullAdmin(user)) {
      return <Navigate to={firstAdminPath(user)} replace />;
    }
    return <Navigate to={firstAdminPath(user)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
