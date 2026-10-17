import React from 'react';
import { Loader2 } from 'lucide-react';
import trustHyreLogo from '../../assets/TrustHyre Skills and Opportunities Logo.png';

export interface AppLoaderProps {
  variant?: 'fullscreen' | 'page' | 'inline' | 'skeleton';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  variant = 'page',
  message,
  size = 'md',
  className = '',
}) => {
  // Inline Spinner for buttons and compact actions
  if (variant === 'inline') {
    const sizeClasses = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    }[size];

    return (
      <div className={`inline-flex items-center gap-2 font-sans ${className}`}>
        <Loader2 className={`${sizeClasses} animate-spin text-current shrink-0`} />
        {message && <span className="text-xs font-medium">{message}</span>}
      </div>
    );
  }

  // Fullscreen Splash/Transition Loader with Clean Light Theme & Official Light Logo
  if (variant === 'fullscreen') {
    return (
      <div className={`fixed inset-0 z-[200] bg-[#F8FAFC] text-[#0A1931] flex flex-col items-center justify-center p-6 font-sans select-none ${className}`}>
        <style>{`
          @keyframes brandProgressSweepLight {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(35%); }
            100% { transform: translateX(250%); }
          }
        `}</style>

        {/* Ambient subtle warm/blue radial backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/70 via-slate-50/50 to-[#F8FAFC] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Official TrustHyre Light Theme Logo */}
          <div className="mb-6 animate-in fade-in duration-300">
            <img 
              src={trustHyreLogo} 
              alt="TrustHyre" 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain block select-none mix-blend-multiply drop-shadow-xs" 
            />
          </div>

          {/* Precision Brand Progress Track */}
          <div className="w-52 h-[3px] rounded-full bg-slate-200/90 overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#0066FF] to-[#38BDF8] rounded-full w-2/5 shadow-xs"
              style={{ animation: 'brandProgressSweepLight 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite' }}
            />
          </div>

          {message && (
            <p className="text-xs text-[#64748B] font-medium tracking-wide mt-4 text-center max-w-xs animate-in fade-in duration-300">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Skeleton variant for job/candidate feed loading
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 w-full font-sans ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-xs animate-pulse space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                <div className="h-3 bg-slate-100 rounded-md w-1/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default Page / Route Content Loader: Clean Light Stage with Official Light Logo
  return (
    <div className={`w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center bg-white border border-[#E2E8F0] text-[#0A1931] rounded-2xl sm:rounded-3xl p-8 relative overflow-hidden shadow-xs font-sans select-none ${className}`}>
      <style>{`
        @keyframes brandProgressSweepLight {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(35%); }
          100% { transform: translateX(250%); }
        }
      `}</style>

      {/* Subtle ambient light gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-white to-white pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Official TrustHyre Light Theme Logo */}
        <div className="mb-6 animate-in fade-in duration-300">
          <img 
            src={trustHyreLogo} 
            alt="TrustHyre" 
            className="h-12 sm:h-14 md:h-16 w-auto object-contain block select-none mix-blend-multiply drop-shadow-xs" 
          />
        </div>

        {/* Precision Brand Progress Track */}
        <div className="w-52 h-[3px] rounded-full bg-slate-200/90 overflow-hidden relative shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#0066FF] to-[#38BDF8] rounded-full w-2/5 shadow-xs"
            style={{ animation: 'brandProgressSweepLight 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite' }}
          />
        </div>

        {message && (
          <p className="text-xs text-[#64748B] font-medium tracking-wide mt-4 text-center max-w-xs animate-in fade-in duration-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppLoader;
