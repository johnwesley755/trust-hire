import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import LandingPage from '../pages/LandingPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import { JobPostingPage } from '../pages/JobPostingPage.tsx';
import { WorkerSearchPage } from '../pages/WorkerSearchPage.tsx';

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
]);
