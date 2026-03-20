import { useAuth, useUser } from "../../../core/providers/AuthContext";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import apiClient from "../../../core/api/apiClient";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isSignedIn && user) {
        if (user.onboarded) {
          setIsOnboarded(true);
          setLoading(false);
          return;
        }

        try {
          const response = await apiClient.post('/api/auth/sync', { role: "WORKER" });
          setIsOnboarded(response.data.onboarded);
          
          if (response.data.onboarded) {
             const storedUser = localStorage.getItem('user');
             if (storedUser) {
                 const userObj = JSON.parse(storedUser);
                 userObj.onboarded = true;
                 localStorage.setItem('user', JSON.stringify(userObj));
             }
          }
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
  }, [isSignedIn, isLoaded, user, getToken]);

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

  if (isOnboarded === false && location.pathname !== "/onboarding" && location.pathname !== "/verify-identity") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
