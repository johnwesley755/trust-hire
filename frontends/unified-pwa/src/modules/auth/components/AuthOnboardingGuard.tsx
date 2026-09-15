import { useAuth, useUser } from "../../../providers/AuthContext";
import { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import apiClient from "../../../api/apiClient";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded, updateUser } = useAuth();
  const { user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const syncStarted = useRef(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (syncStarted.current) return;

      if (isSignedIn && user) {
        const hasPhone = Boolean(user.phoneNumber || (user as any).phone_number);
        
        if (user.role === 'WORKER') {
          const isWorkerOnboarded = Boolean(user.onboarded && hasPhone);
          setIsOnboarded(isWorkerOnboarded);
          setLoading(false);
          return;
        }

        const isLocalOnboarded = user.onboarded || localStorage.getItem('onboarded') === 'true';

        if (isLocalOnboarded) {
          setIsOnboarded(true);
          setLoading(false);
          return;
        }

        syncStarted.current = true;
        try {
          const response = await apiClient.post('/api/auth/sync', { role: "EMPLOYER" });
          const syncedUser = response.data;
          setIsOnboarded(!!syncedUser.onboarded);
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
  }, [isSignedIn, isLoaded, user, location.pathname, updateUser]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A1931]"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If user is not onboarded, redirect to /onboarding
  if (isOnboarded === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is already onboarded, prevent access to /onboarding
  if (isOnboarded === true && location.pathname === "/onboarding") {
    const target = user?.role === 'EMPLOYER' ? '/dashboard' : '/search';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
