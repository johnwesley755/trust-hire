import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { setupInterceptors } from '../api/apiClient';
import { ShieldAlert, LogOut, Clock } from 'lucide-react';
import type { User, UserRole } from '../types';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import apiClient from '../api/apiClient';

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  sessionExpired: boolean;
  role: UserRole | null;
  getToken: () => Promise<string | null>;
  updateUser: (data: Partial<User>) => void;
  login: (token: string, userData: any) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  signInWithGoogle: (targetRole?: UserRole) => Promise<void>;
  sendEmployerOtp: (email: string) => Promise<void>;
  verifyEmployerOtp: (email: string, otp: string) => Promise<User>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useAuth();
  return { user, isLoaded, isSignedIn };
};

export const SignedIn = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOut = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useAuth();
  return !isSignedIn ? <>{children}</> : null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  const mapUserFields = (data: any): User => {
    return {
      id: data.userId || data.id,
      email: data.email,
      role: (data.role || 'WORKER') as UserRole,
      onboarded: !!data.onboarded,
      identityVerified: !!(data.identityVerified ?? data.identity_verified),
      firstName: data.firstName ?? data.first_name ?? (data.displayName?.split(' ')[0] || ''),
      lastName: data.lastName ?? data.last_name ?? (data.displayName?.split(' ').slice(1).join(' ') || ''),
      phoneNumber: data.phoneNumber ?? data.phone_number,
      profileImageUrl: data.profileImageUrl ?? data.profile_image_url ?? data.photoURL,
      companyName: data.companyName ?? data.company_name,
      location: data.location,
      createdAt: data.createdAt ?? data.created_at,
      updatedAt: data.updatedAt ?? data.updated_at,
    };
  };

  useEffect(() => {
    const initAuth = () => {
      // 1. Check local session
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoaded(true);
    };

    initAuth();

    let syncInProgress = false;

    // 2. Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && !syncInProgress) {
        const token = localStorage.getItem('token');
        if (!token) {
          syncInProgress = true;
          const targetRole = (localStorage.getItem('target_role') || 'WORKER') as UserRole;
          const nameParts = (fbUser.displayName || 'Worker').split(' ');
          const firstName = nameParts[0] || 'Worker';
          const lastName = nameParts.slice(1).join(' ') || '';

          try {
            const idToken = await fbUser.getIdToken();
            const syncRes = await apiClient.post('/api/auth/oauth-sync', {
              idToken,
              email: fbUser.email,
              firstName,
              lastName,
              profileImageUrl: fbUser.photoURL,
              role: targetRole,
            });
            const payload = syncRes.data?.data || syncRes.data;
            if (payload?.token && payload?.user) {
              setAuthError(null);
              login(payload.token, payload.user);
            }
          } catch (syncErr: any) {
            console.error("Backend oauth sync failed:", syncErr);
            const errorMessage = syncErr?.response?.data?.message || syncErr?.message || "Authentication failed.";
            setAuthError(errorMessage);
            window.dispatchEvent(new CustomEvent('auth:error', { detail: errorMessage }));
            await firebaseSignOut(auth);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } finally {
            syncInProgress = false;
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setSessionExpired(true);
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const getToken = async () => localStorage.getItem('token');

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const switchRole = (newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, role: newRole };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const login = (token: string, userData: any) => {
    const mappedUser = mapUserFields(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    setUser(mappedUser);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const signInWithGoogle = async (targetRole: UserRole = 'WORKER') => {
    setAuthError(null);
    localStorage.setItem('target_role', targetRole);
    try {
      await signInWithPopup(auth, googleProvider);
      // Wait for onAuthStateChanged to handle the sync
      let retries = 0;
      const checkToken = setInterval(() => {
        if (localStorage.getItem('token')) {
          clearInterval(checkToken);
          const storedUser = localStorage.getItem('user');
          let parsed: any = null;
          try { parsed = storedUser ? JSON.parse(storedUser) : null; } catch {}
          if (!parsed?.phoneNumber && !parsed?.phone_number && parsed?.role !== 'EMPLOYER') {
            window.location.href = '/onboarding';
          } else {
            const dest = parsed?.role === 'ADMIN' ? '/admin/dashboard' : parsed?.role === 'EMPLOYER' ? '/find-workers' : '/search';
            window.location.href = dest;
          }
        } else if (retries > 40) { // 20 seconds timeout
          clearInterval(checkToken);
        }
        retries++;
      }, 500);
      
    } catch (error: any) {
      console.warn("Firebase Google Auth error:", error.code, error.message);
      // Suppress benign popup closure / cancellation
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      const errorMsg = error?.response?.data?.message || error.message || "Google Sign-In failed.";
      setAuthError(errorMsg);
      window.dispatchEvent(new CustomEvent('auth:error', { detail: errorMsg }));
    }
  };

  const sendEmployerOtp = async (email: string) => {
    await apiClient.post('/api/auth/send-otp', { email });
  };

  const verifyEmployerOtp = async (email: string, otp: string) => {
    const res = await apiClient.post('/api/auth/verify-employer-otp', { email, otp });
    const payload = res.data?.data || res.data;
    const userData = payload.user || payload;
    const token = payload.token;
    if (token && userData) {
      login(token, userData);
    }
    return mapUserFields(userData);
  };

  useEffect(() => {
    setupInterceptors(getToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        isLoaded,
        sessionExpired,
        role: user?.role || null,
        getToken,
        updateUser,
        login,
        logout,
        switchRole,
        signInWithGoogle,
        sendEmployerOtp,
        verifyEmployerOtp,
        authError,
        clearAuthError,
      }}
    >
      {children}

      {sessionExpired && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0A1931]/60 backdrop-blur-md" />
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#FACD15]/10 rounded-2xl flex items-center justify-center mx-auto relative">
                <ShieldAlert className="w-8 h-8 text-[#FACD15]" />
                <Clock className="w-5 h-5 text-[#0A1931] absolute -bottom-1 -right-1" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#0A1931] tracking-tight">
                  Session Expired
                </h3>
                <p className="text-xs font-medium text-[#0A1931]/60 leading-relaxed px-2">
                  Your session has timed out. Please sign in again.
                </p>
              </div>

              <button
                onClick={logout}
                className="w-full bg-[#0A1931] text-[#FACD15] py-3 rounded-xl font-bold uppercase text-xs tracking-wider hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
