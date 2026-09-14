import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from '../modules/landing/pages/LandingPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import TrackerPage from '../modules/dashboard/pages/TrackerPage';
import { JobPostingPage } from '../modules/jobs/pages/JobPostingPage';
import { WorkerSearchPage } from '../modules/search/pages/WorkerSearchPage';
import ApplicationManagementPage from '../modules/jobs/pages/ApplicationManagementPage';
import { WorkerProfilePage } from '../modules/search/pages/WorkerProfilePage';
import JobSearchPage from '../modules/jobs/pages/JobSearchPage';
import JobDetailPage from '../modules/jobs/pages/JobDetailPage';
import AppliedJobsPage from '../modules/jobs/pages/AppliedJobsPage';
import { SkillTestsPage } from '../modules/profile/pages/SkillTestsPage';
import { LevelDetailsPage } from '../modules/profile/pages/LevelDetailsPage';
import { IdentityVerificationPage } from '../modules/profile/pages/IdentityVerificationPage';
import { SignInPage } from '../modules/auth/pages/SignInPage';
import { SignUpPage } from '../modules/auth/pages/SignUpPage';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage';
import OnboardingPage from '../modules/profile/pages/OnboardingPage';
import ProfilePage from '../modules/profile/pages/ProfilePage';
import { SettingsPage } from '../modules/settings/pages/SettingsPage';
import { HelpPage } from '../modules/help/pages/HelpPage';
import { ActiveJobsPage } from '../modules/jobs/pages/ActiveJobsPage';
import TermsPage from '../modules/landing/pages/TermsPage';
import PrivacyPage from '../modules/landing/pages/PrivacyPage';

import AppLayout from '../layouts/AppLayout';
import RootLayout from '../layouts/RootLayout';
import ProtectedRoute from '../layouts/ProtectedRoute';

import RoleGuard from '../layouts/RoleGuard';

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
        path: '/terms',
        element: <TermsPage />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/onboarding',
        element: (
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
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
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          /* Employer Specific Routes (Protected by RoleGuard) */
          {
            element: <RoleGuard allowedRoles={['EMPLOYER']} />,
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
            ]
          },

          /* Worker Specific Routes (Protected by RoleGuard) */
          {
            element: <RoleGuard allowedRoles={['WORKER']} />,
            children: [
              {
                path: '/tracker',
                element: <TrackerPage />,
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
                path: '/tests',
                element: <SkillTestsPage />,
              },
              {
                path: '/level',
                element: <LevelDetailsPage />,
              },
            ]
          },

          /* Shared Authenticated Routes */
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
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
