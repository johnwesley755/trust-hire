import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import LandingPage from '../pages/LandingPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import { JobPostingPage } from '../pages/JobPostingPage.tsx';
import { WorkerSearchPage } from '../pages/WorkerSearchPage.tsx';
import ApplicationManagementPage from '../pages/ApplicationManagementPage.tsx';
import { WorkerProfilePage } from '../pages/WorkerProfilePage.tsx';
import { SignInPage } from '../pages/SignInPage.tsx';
import { SignUpPage } from '../pages/SignUpPage.tsx';
import OnboardingPage from '../pages/OnboardingPage.tsx';
import { AuthOnboardingGuard } from '../components/AuthOnboardingGuard.tsx';

import { ActiveJobsPage } from '../pages/ActiveJobsPage.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthOnboardingGuard>
    {children}
  </AuthOnboardingGuard>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <SignedOut><LandingPage /></SignedOut>
        <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
      </>
    ),
  },
  {
    path: '/sign-in/*',
    element: <SignInPage />,
  },
  {
    path: '/sign-up/*',
    element: <SignUpPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <SignedIn>
        <OnboardingPage />
      </SignedIn>
    ),
  },
  {
    path: '/post-job',
    element: (
      <ProtectedRoute>
        <JobPostingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/jobs',
    element: (
      <ProtectedRoute>
        <ActiveJobsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/find-workers',
    element: (
      <ProtectedRoute>
        <WorkerSearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/worker/:id',
    element: (
      <ProtectedRoute>
        <WorkerProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/applications',
    element: (
      <ProtectedRoute>
        <ApplicationManagementPage />
      </ProtectedRoute>
    ),
  },
]);
