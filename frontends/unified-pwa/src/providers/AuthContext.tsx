import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { setupInterceptors } from '../api/apiClient';
import type { User, UserRole } from '../types';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import apiClient from '../api/apiClient';

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
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

  const login = (token: string, userData: any) => {
    const mappedUser = mapUserFields(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    setUser(mappedUser);
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
          try { 
            parsed = storedUser ? JSON.parse(storedUser) : null; 
          } catch {
            /* ignore parse error */
          }
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
    </AuthContext.Provider>
  );
};
