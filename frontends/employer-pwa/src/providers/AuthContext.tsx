import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { setupInterceptors } from '../api/apiClient';
import { ShieldAlert, LogOut, Clock } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  onboarded: boolean;
  identityVerified: boolean;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  getToken: () => Promise<string | null>;
  updateUser: (data: Partial<User>) => void;
  login: (token: string, userData: User) => void;
  logout: () => void;
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

  useEffect(() => {
    const initAuth = async () => {
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
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      setSessionExpired(true);
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const getToken = async () => localStorage.getItem('token');
  
  const mapUserFields = (data: any): User => {
    return {
      id: data.userId || data.id,
      email: data.email,
      role: data.role,
      onboarded: data.onboarded,
      identityVerified: data.identityVerified ?? data.identity_verified,
      firstName: data.firstName ?? data.first_name,
      lastName: data.lastName ?? data.last_name,
      profileImageUrl: data.profileImageUrl ?? data.profile_image_url,
      companyName: data.companyName,
    };
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/sign-in';
  };

  useEffect(() => {
    setupInterceptors(getToken);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, isLoaded, getToken, updateUser, login, logout }}>
      {children}
      
      {sessionExpired && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1F3F34]/60 backdrop-blur-md" />
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-[#FACD15]/10 rounded-[2rem] flex items-center justify-center mx-auto relative">
                <ShieldAlert className="w-10 h-10 text-[#FACD15]" />
                <Clock className="w-6 h-6 text-[#1F3F34] absolute -bottom-1 -right-1" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight leading-none">Session Expired</h3>
                <p className="text-xs font-bold text-[#1F3F34]/40 uppercase tracking-widest leading-relaxed px-4">
                  Your protocol has timed out for security. Please re-authenticate.
                </p>
              </div>

              <button 
                onClick={logout}
                className="w-full bg-[#1F3F34] text-[#FACD15] py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1F3F34]/20"
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
