import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          const response = await axios.post(
            `${API_URL}/auth/sync`,
            { role: "EMPLOYER" },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsOnboarded(response.data.onboarded);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isOnboarded === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
