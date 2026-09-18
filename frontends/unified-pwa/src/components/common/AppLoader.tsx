import React from 'react';
import { Loader2 } from 'lucide-react';
import logo from '../../assets/logo.png';

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
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <Loader2 className={`${sizeClasses} animate-spin text-current shrink-0`} />
        {message && <span className="text-xs font-medium">{message}</span>}
      </div>
    );
  }

  // Fullscreen Splash/Auth Loader
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A1931] text-white p-4">
        <div className="relative flex items-center justify-center mb-5">
          {/* Outer glowing pulsing ring */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-[#0066FF]/30 animate-ping" />
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-xl">
            <img src="/logo.png" alt="TrustHyre" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-5 h-5 text-[#38BDF8] animate-spin" />
          <span className="text-sm font-extrabold tracking-wide font-['Outfit',sans-serif]">Trust<span className="text-[#38BDF8]">Hyre</span></span>
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          {message || 'Connecting to verified network...'}
        </p>
      </div>
    );
  }

  // Skeleton variant for job feed loading
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 w-full ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default Page / Container Loader
  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div className={`min-h-[260px] flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-2xs">
          <Loader2 className={`${spinnerSizes} text-[#0066FF] animate-spin`} />
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit',sans-serif]">
        {message || 'Loading content...'}
      </p>
    </div>
  );
};

export default AppLoader;
