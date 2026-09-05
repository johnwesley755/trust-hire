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
        // Workers navigate directly to tracker and search
        if (user.role === 'WORKER') {
          setIsOnboarded(true);
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
          const response = await apiClient.post('/api/auth/sync', { role: user.role || "EMPLOYER" });
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
      <div className="flex items-center justify-center min-h-screen bg-[#F5F4EF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F3F34]"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (isOnboarded === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (isOnboarded === true && location.pathname === "/onboarding") {
    const target = user?.role === 'EMPLOYER' ? '/dashboard' : '/tracker';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
