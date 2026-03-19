import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { setupInterceptors } from '../api/apiClient';

interface User {
  id: string;
  email: string;
  role: string;
  onboarded: boolean;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  level?: number;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  getToken: () => Promise<string | null>;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Custom hook for accessing user profile and auth state
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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoaded(true);
    };
    initAuth();
  }, []);

  const getToken = async () => localStorage.getItem('token');

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    setupInterceptors(getToken);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, isLoaded, getToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
