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
    path: '/verify',
    element: (
      <SignedIn>
        <IdentityVerificationPage />
      </SignedIn>
    ),
  },
  {
    path: '/tests',
    element: (
      <SignedIn>
        <SkillTestsPage />
      </SignedIn>
    ),
  },
  {
    path: '/level',
    element: (
      <SignedIn>
        <LevelDetailsPage />
      </SignedIn>
    ),
  },
  {
    path: '/search',
    element: (
      <SignedIn>
        <JobSearchPage />
      </SignedIn>
    ),
  },
  {
    path: '/job/:id',
    element: (
      <SignedIn>
        <JobDetailPage />
      </SignedIn>
    ),
  },
]);
