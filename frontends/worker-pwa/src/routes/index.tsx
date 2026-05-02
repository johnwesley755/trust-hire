import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn } from '../providers/AuthContext.tsx';
import LandingPage from '../modules/landing/pages/LandingPage.tsx';
import DashboardPage from '../modules/dashboard/pages/DashboardPage.tsx';
import { IdentityVerificationPage } from '../modules/profile/pages/IdentityVerificationPage.tsx';
import JobSearchPage from '../modules/jobs/pages/JobSearchPage.tsx';
import JobDetailPage from '../modules/jobs/pages/JobDetailPage.tsx';
import { SkillTestsPage } from '../modules/profile/pages/SkillTestsPage.tsx';
import { LevelDetailsPage } from '../modules/profile/pages/LevelDetailsPage.tsx';
import { SignInPage } from '../modules/auth/pages/SignInPage.tsx';
import { SignUpPage } from '../modules/auth/pages/SignUpPage.tsx';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage.tsx';
import ProfilePage from '../modules/profile/pages/ProfilePage.tsx';
import AppliedJobsPage from '../modules/jobs/pages/AppliedJobsPage.tsx';
import OnboardingPage from '../modules/profile/pages/OnboardingPage.tsx';
import { SettingsPage } from '../modules/settings/pages/SettingsPage.tsx';
import { HelpPage } from '../modules/help/HelpPage.tsx';

import AppLayout from '../layouts/AppLayout.tsx';
import RootLayout from '../layouts/RootLayout.tsx';
import ProtectedRoute from '../layouts/ProtectedRoute.tsx';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
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
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          {
            path: '/help',
            element: <HelpPage />,
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
        path: '/verify-identity',
        element: (
          <ProtectedRoute>
            <IdentityVerificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/jobs',
        element: <Navigate to="/search" replace />,
      },
    ],
  },
]);

