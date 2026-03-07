import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import LandingPage from '../pages/LandingPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import { IdentityVerificationPage } from '../pages/IdentityVerificationPage.tsx';
import JobSearchPage from '../pages/JobSearchPage.tsx';
import JobDetailPage from '../pages/JobDetailPage.tsx';
import { SkillTestsPage } from '../pages/SkillTestsPage.tsx';
import { LevelDetailsPage } from '../pages/LevelDetailsPage.tsx';
import { SignInPage } from '../pages/SignInPage.tsx';
import { SignUpPage } from '../pages/SignUpPage.tsx';
import ProfilePage from '../pages/ProfilePage.tsx';
import HistoryPage from '../pages/HistoryPage.tsx';
import OnboardingPage from '../pages/OnboardingPage.tsx';
import { AuthOnboardingGuard } from '../components/AuthOnboardingGuard.tsx';

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
    path: '/verify',
    element: (
      <ProtectedRoute>
        <IdentityVerificationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tests',
    element: (
      <ProtectedRoute>
        <SkillTestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/level',
    element: (
      <ProtectedRoute>
        <LevelDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/search',
    element: (
      <ProtectedRoute>
        <JobSearchPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/jobs',
    element: <Navigate to="/search" replace />,
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <HistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/job/:id',
    element: (
      <ProtectedRoute>
        <JobDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
]);
