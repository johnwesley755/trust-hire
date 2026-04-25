import { createBrowserRouter } from 'react-router-dom';
import { SignedIn } from '../core/providers/AuthContext';
import LandingPage from '../modules/landing/pages/LandingPage.tsx';
import DashboardPage from '../modules/dashboard/pages/DashboardPage.tsx';
import { JobPostingPage } from '../modules/jobs/pages/JobPostingPage.tsx';
import { WorkerSearchPage } from '../modules/search/pages/WorkerSearchPage.tsx';
import ApplicationManagementPage from '../modules/jobs/pages/ApplicationManagementPage.tsx';
import { WorkerProfilePage } from '../modules/search/pages/WorkerProfilePage.tsx';
import { SignInPage } from '../modules/auth/pages/SignInPage.tsx';
import { SignUpPage } from '../modules/auth/pages/SignUpPage.tsx';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage.tsx';
import OnboardingPage from '../modules/profile/pages/OnboardingPage.tsx';

import { ActiveJobsPage } from '../modules/jobs/pages/ActiveJobsPage.tsx';
import ProfilePage from '../modules/profile/pages/ProfilePage.tsx';
import { SettingsPage } from '../modules/settings/pages/SettingsPage.tsx';

import AppLayout from '../core/layouts/AppLayout.tsx';
import RootLayout from '../core/layouts/RootLayout.tsx';
import ProtectedRoute from '../core/layouts/ProtectedRoute.tsx';

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
        path: '/onboarding',
        element: (
          <SignedIn>
            <OnboardingPage />
          </SignedIn>
        ),
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
            path: '/post-job',
            element: <JobPostingPage />,
          },
          {
            path: '/jobs',
            element: <ActiveJobsPage />,
          },
          {
            path: '/find-workers',
            element: <WorkerSearchPage />,
          },
          {
            path: '/worker/:id',
            element: <WorkerProfilePage />,
          },
          {
            path: '/applications',
            element: <ApplicationManagementPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);

