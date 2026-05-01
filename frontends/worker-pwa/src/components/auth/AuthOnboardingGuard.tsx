import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { updateUser } from "../../store/slices/authSlice";
import { Navigate, useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading: authLoading } = useAppSelector((state) => state.auth);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const syncStarted = useRef(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (syncStarted.current) return;

      if (isAuthenticated && user) {
        const isLocalOnboarded = user.onboarded || false;
        const isLocalIdentityVerified = user.identity_verified || false;

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
          dispatch(updateUser(syncedUser));
        } catch (error) {
          console.error("Onboarding check failed:", error);
          setIsOnboarded(false);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !isAuthenticated) {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, authLoading, user, dispatch, location.pathname]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FACD15]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (isOnboarded === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  const isIdentityVerified = user?.identity_verified || false;
  if (isOnboarded === true && !isIdentityVerified && location.pathname !== "/verify-identity") {
    return <Navigate to="/verify-identity" replace />;
  }

  return <>{children}</>;
};
