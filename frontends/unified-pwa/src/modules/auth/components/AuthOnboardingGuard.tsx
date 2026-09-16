import { useAuth, useUser } from "../../../providers/AuthContext";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import apiClient from "../../../api/apiClient";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded, updateUser } = useAuth();
  const { user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false;

    const checkOnboarding = async () => {
      if (isSignedIn && user) {
        const hasPhone = Boolean(user.phoneNumber || (user as any).phone_number);
        
        if (user.role === 'WORKER') {
          const isWorkerOnboarded = Boolean(user.onboarded && hasPhone);
          if (!isCancelled) {
            setIsOnboarded(isWorkerOnboarded);
            setLoading(false);
          }
          return;
        }

        const isLocalOnboarded = Boolean(user.onboarded || localStorage.getItem('onboarded') === 'true');

        if (isLocalOnboarded) {
          if (!isCancelled) {
            setIsOnboarded(true);
            setLoading(false);
          }
          return;
        }

        try {
          const response = await apiClient.post('/api/auth/sync', { role: "EMPLOYER" });
          const syncedUser = response.data?.data || response.data;
          if (!isCancelled) {
            setIsOnboarded(Boolean(syncedUser.onboarded));
            updateUser(syncedUser);
          }
        } catch (error) {
          console.error("Onboarding check failed:", error);
          if (!isCancelled) {
            setIsOnboarded(false);
          }
        } finally {
          if (!isCancelled) {
            setLoading(false);
          }
        }
      } else if (isLoaded && !isSignedIn) {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      isCancelled = true;
    };
  }, [isSignedIn, isLoaded, user?.onboarded, user?.phoneNumber, user?.role, location.pathname]);

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
