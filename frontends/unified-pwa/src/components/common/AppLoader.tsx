import React from 'react';
import { Loader2 } from 'lucide-react';
import trustHyreLogo from '../../assets/TrustHyre Logo with Skills Tagline.png';

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

  // Fullscreen Splash/Auth Loader with Deep-Navy Brand Canvas and Official Logo
  if (variant === 'fullscreen') {
    return (
      <div className={`fixed inset-0 z-[200] bg-[#0f2f63] text-white flex flex-col items-center justify-center p-6 font-['Onest',system-ui,sans-serif] select-none ${className}`}>
        <style>{`
          @keyframes brandProgressSweep {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(40%); }
            100% { transform: translateX(260%); }
          }
        `}</style>

        {/* Official TrustHyre White Logo on Deep-Navy Brand Canvas */}
        <div className="mb-8 animate-in fade-in duration-300">
          <img 
            src={trustHyreLogo} 
            alt="TrustHyre" 
            className="h-14 sm:h-16 md:h-20 w-auto object-contain block select-none drop-shadow-2xl" 
          />
        </div>

        {/* Brand Horizontal Progress Track */}
        <div className="w-52 h-[2.5px] rounded-full bg-white/20 overflow-hidden relative">
          <div 
            className="h-full bg-white rounded-full w-2/5"
            style={{ animation: 'brandProgressSweep 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite' }}
          />
        </div>

        {message && (
          <p className="text-xs text-white/70 font-medium tracking-wide mt-4 text-center max-w-xs animate-in fade-in duration-300">
            {message}
          </p>
        )}
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

  // Default Page / Common Background Loader: Solid Deep-Navy Brand Stage with Official Logo
  return (
    <div className={`w-full min-h-[55vh] sm:min-h-[65vh] flex flex-col items-center justify-center bg-[#0f2f63] text-white rounded-2xl sm:rounded-3xl p-8 relative overflow-hidden shadow-xs font-['Onest',system-ui,sans-serif] select-none ${className}`}>
      <style>{`
        @keyframes brandProgressSweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(40%); }
          100% { transform: translateX(260%); }
        }
      `}</style>

      {/* Official TrustHyre White Logo on Deep-Navy Brand Stage */}
      <div className="mb-8 animate-in fade-in duration-300">
        <img 
          src={trustHyreLogo} 
          alt="TrustHyre" 
          className="h-14 sm:h-16 md:h-20 w-auto object-contain block select-none drop-shadow-2xl" 
        />
      </div>

      {/* Brand Horizontal Progress Track */}
      <div className="w-52 h-[2.5px] rounded-full bg-white/20 overflow-hidden relative">
        <div 
          className="h-full bg-white rounded-full w-2/5"
          style={{ animation: 'brandProgressSweep 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite' }}
        />
      </div>

      {message && (
        <p className="text-xs text-white/70 font-medium tracking-wide mt-4 text-center max-w-xs animate-in fade-in duration-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default AppLoader;
