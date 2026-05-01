import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ShieldAlert, LogOut, Clock } from 'lucide-react';

export const SessionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handleAuthExpired = () => {
      setSessionExpired(true);
    };
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setSessionExpired(false);
    window.location.href = '/sign-in';
  };

  return (
    <>
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
                <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight leading-none bricolage">Session Timeout</h3>
                <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest leading-relaxed px-4">
                  Your secure session has expired. Please sign in again to continue.
                </p>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full bg-[#FACD15] text-[#1F3F34] py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#FACD15]/20"
              >
                <LogOut className="w-4 h-4" />
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
      `}</style>
    </>
  );
};
