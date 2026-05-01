import { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { syncUser, setLoaded } from "../../store/slices/authSlice";

export const AuthOnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, token, isLoaded } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const syncStarted = useRef(false);

  const isSignedIn = !!token;

  useEffect(() => {
    const checkAuth = async () => {
      if (syncStarted.current) return;

      if (isSignedIn && user) {
        const isLocalOnboarded = user.onboarded || localStorage.getItem('onboarded') === 'true';

        if (isLocalOnboarded) {
          dispatch(setLoaded());
          return;
        }

        syncStarted.current = true;
        dispatch(syncUser());
      } else {
        dispatch(setLoaded());
      }
    };

    checkAuth();
  }, [isSignedIn, user, dispatch]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F4EF]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#1F3F34] opacity-20"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (user?.onboarded === false && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
