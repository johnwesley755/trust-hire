import { useAuth, useUser } from "../../../core/providers/AuthContext";
import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import apiClient from "../../../core/api/apiClient";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded, getToken, updateUser } = useAuth();
  const { user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const syncStarted = useRef(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      // If already syncing, skip
      if (syncStarted.current) return;

      if (isSignedIn && user) {
        const isLocalOnboarded = user.onboarded || localStorage.getItem('onboarded') === 'true';
        const isLocalIdentityVerified = user.identity_verified || false;

        // If we have both onboarded and identity_verified locally, we can skip sync
        if (isLocalOnboarded && isLocalIdentityVerified) {
          setIsOnboarded(true);
          setLoading(false);
          return;
        }

        syncStarted.current = true;
        try {
          const response = await apiClient.post('/api/auth/sync', { role: "WORKER" });
          const syncedUser = response.data;
          setIsOnboarded(syncedUser.onboarded);
          
          // Update the global auth context
          updateUser(syncedUser);
        } catch (error) {
          console.error("Onboarding check failed:", error);
          setIsOnboarded(false);
        } finally {
          setLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [isSignedIn, isLoaded, location.pathname]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isOnboarded === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Next level: Identity Verification
  const isIdentityVerified = user?.identity_verified || false;
  if (isOnboarded === true && !isIdentityVerified && location.pathname !== "/verify-identity") {
    return <Navigate to="/verify-identity" replace />;
  }

  return <>{children}</>;
};
