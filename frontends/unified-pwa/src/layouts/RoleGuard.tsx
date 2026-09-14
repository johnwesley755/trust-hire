import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, useUser } from '../providers/AuthContext';
import type { UserRole } from '../types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A1931]"></div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    const defaultRole = allowedRoles.includes('EMPLOYER') ? 'EMPLOYER' : 'WORKER';
    return <Navigate to={`/sign-in?role=${defaultRole}`} state={{ from: location }} replace />;
  }

  const userRole = (user.role || 'WORKER') as UserRole;

  if (!allowedRoles.includes(userRole)) {
    // Cross-role interception: redirect to the respective user workspace
    const targetDashboard = userRole === 'EMPLOYER' ? '/dashboard' : '/search';
    return <Navigate to={targetDashboard} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
