import React from 'react';
import { AuthOnboardingGuard } from '../../modules/auth/components/AuthOnboardingGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => (
  <AuthOnboardingGuard>
    {children}
  </AuthOnboardingGuard>
);

export default ProtectedRoute;
