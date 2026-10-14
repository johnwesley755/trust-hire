import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

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
      <div className={`inline-flex items-center gap-2 font-['Onest',system-ui,sans-serif] ${className}`}>
        <Loader2 className={`${sizeClasses} animate-spin text-current shrink-0`} />
        {message && <span className="text-xs font-medium">{message}</span>}
      </div>
    );
  }

  // Fullscreen Splash/Auth Loader with frosted Hallmark canvas
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md text-[#0a0a0a] p-4 font-['Onest',system-ui,sans-serif]">
        <div className="relative flex items-center justify-center mb-5">
          {/* Subtle outer pulsing ring */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-[#0f2f63]/20 animate-ping" />
          <div className="w-16 h-16 rounded-3xl bg-[#f4f4f4] border border-[#e6e8ec] p-3 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-9 h-9 text-[#0f2f63]" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Loader2 className="w-4 h-4 text-[#0f2f63] animate-spin" />
          <span 
            className="text-lg font-bold text-[#0a0a0a]"
            style={{ fontFamily: 'Onest, system-ui, sans-serif' }}
          >
            Trust<span className="text-[#0f2f63]">Hyre</span>
          </span>
        </div>
        <p className="text-xs font-semibold text-[#717784]">
          {message || 'Connecting to verified network...'}
        </p>
      </div>
    );
  }

  // Skeleton variant for job/candidate feed loading
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 w-full font-['Onest',system-ui,sans-serif] ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-[#e6e8ec] shadow-2xs animate-pulse space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f4f4f4] rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-4 bg-[#f4f4f4] rounded-md w-1/3" />
                <div className="h-3 bg-[#f4f4f4] rounded-md w-1/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e6e8ec]">
              <div className="h-3 bg-[#f4f4f4] rounded-md w-1/2" />
              <div className="h-3 bg-[#f4f4f4] rounded-md w-1/2" />
              <div className="h-3 bg-[#f4f4f4] rounded-md w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default Page / Common Background Loader
  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div className={`w-full min-h-[50vh] flex flex-col items-center justify-center gap-3 p-6 font-['Onest',system-ui,sans-serif] ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Subtle breathing ripple */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-[#0f2f63]/15 animate-ping" />
        <div className="w-14 h-14 rounded-2xl bg-[#f4f4f4] border border-[#e6e8ec] flex items-center justify-center shadow-2xs text-[#0f2f63] relative z-10">
          <ShieldCheck className="w-7 h-7 text-[#0f2f63]" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Loader2 className="w-4 h-4 text-[#0f2f63] animate-spin" />
        <span 
          className="text-sm font-bold text-[#0a0a0a]"
          style={{ fontFamily: 'Onest, system-ui, sans-serif' }}
        >
          Trust<span className="text-[#0f2f63]">Hyre</span>
        </span>
      </div>
      <p className="text-xs font-semibold text-[#717784]">
        {message || 'Loading verified content...'}
      </p>
    </div>
  );
};

export default AppLoader;
