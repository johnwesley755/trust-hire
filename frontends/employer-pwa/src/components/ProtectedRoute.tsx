import React from 'react';
import { AuthOnboardingGuard } from './AuthOnboardingGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => (
  <AuthOnboardingGuard>
    {children}
  </AuthOnboardingGuard>
);

export default ProtectedRoute;
