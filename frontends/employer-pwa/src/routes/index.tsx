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
      <>
        <SignedIn><DashboardPage /></SignedIn>
        <SignedOut><Navigate to="/" replace /></SignedOut>
      </>
    ),
  },
  {
    path: '/post-job',
    element: (
      <SignedIn>
        <JobPostingPage />
      </SignedIn>
    ),
  },
  {
    path: '/find-workers',
    element: (
      <SignedIn>
        <WorkerSearchPage />
      </SignedIn>
    ),
  },
  {
    path: '/worker/:id',
    element: (
      <SignedIn>
        <WorkerProfilePage />
      </SignedIn>
    ),
  },
  {
    path: '/applications',
    element: (
      <SignedIn>
        <ApplicationManagementPage />
      </SignedIn>
    ),
  },
]);
