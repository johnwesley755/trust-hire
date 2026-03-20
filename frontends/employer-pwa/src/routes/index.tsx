import { createBrowserRouter } from 'react-router-dom';
import { SignedIn } from '../providers/AuthContext';
import LandingPage from '../pages/LandingPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import { JobPostingPage } from '../pages/JobPostingPage.tsx';
import { WorkerSearchPage } from '../pages/WorkerSearchPage.tsx';
import ApplicationManagementPage from '../pages/ApplicationManagementPage.tsx';
import { WorkerProfilePage } from '../pages/WorkerProfilePage.tsx';
import { SignInPage } from '../pages/SignInPage.tsx';
import { SignUpPage } from '../pages/SignUpPage.tsx';
import OnboardingPage from '../pages/OnboardingPage.tsx';

import { ActiveJobsPage } from '../pages/ActiveJobsPage.tsx';
import ProfilePage from '../pages/ProfilePage.tsx';

import AppLayout from '../components/AppLayout.tsx';
import RootLayout from '../components/RootLayout.tsx';
import ProtectedRoute from '../components/ProtectedRoute.tsx';

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
        ],
      },
    ],
  },
]);
