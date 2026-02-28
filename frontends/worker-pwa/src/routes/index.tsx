import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import LandingPage from '../pages/LandingPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import { IdentityVerificationPage } from '../pages/IdentityVerificationPage.tsx';

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
    path: '/verify',
    element: (
      <SignedIn>
        <IdentityVerificationPage />
      </SignedIn>
    ),
  },
]);
