import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn } from '../providers/AuthContext';
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
import AppliedJobsPage from '../pages/AppliedJobsPage.tsx';
import OnboardingPage from '../pages/OnboardingPage.tsx';
import { AuthOnboardingGuard } from '../components/AuthOnboardingGuard.tsx';
import AppLayout from '../components/AppLayout.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthOnboardingGuard>
    {children}
  </AuthOnboardingGuard>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
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
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/verify-identity',
        element: <IdentityVerificationPage />,
      },
      {
        path: '/tests',
        element: <SkillTestsPage />,
      },
      {
        path: '/level',
        element: <LevelDetailsPage />,
      },
      {
        path: '/search',
        element: <JobSearchPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/applied-jobs',
        element: <AppliedJobsPage />,
      },
      {
        path: '/job/:id',
        element: <JobDetailPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ]
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
    path: '/jobs',
    element: <Navigate to="/search" replace />,
  },
]);
