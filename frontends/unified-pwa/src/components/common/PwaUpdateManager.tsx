import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Sparkles, X, AlertTriangle, Loader2 } from 'lucide-react';
import { checkIsUserBusy } from '../../hooks/useUserActivityGuard';

const PWA_DISMISS_KEY = 'trusthyre_pwa_update_dismissed';

export const PwaUpdateManager: React.FC = () => {
  const location = useLocation();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem(PWA_DISMISS_KEY) === 'true';
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // In development mode, auto-clean old SW registrations on localhost and do not show PWA update popups
  useEffect(() => {
    if (import.meta.env.DEV && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          // Keep firebase-messaging-sw if active, but unregister any old workbox dev workers
          if (!reg.active?.scriptURL.includes('firebase-messaging-sw.js')) {
            reg.unregister().catch(() => {});
          }
        });
      });
    }
  }, []);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r && !import.meta.env.DEV) {
        registrationRef.current = r;

        // Periodic background update check (every 30 minutes in production)
        const intervalId = setInterval(() => {
          const dismissed = sessionStorage.getItem(PWA_DISMISS_KEY) === 'true';
          if (!dismissed) {
            r.update().catch((err) => console.debug('Periodic SW update check notice:', err));
          }
        }, 30 * 60 * 1000);

        // Check for updates when tab regains focus (only if not dismissed in session)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            const dismissed = sessionStorage.getItem(PWA_DISMISS_KEY) === 'true';
            if (!dismissed) {
              r.update().catch((err) => console.debug('Visibility SW update check notice:', err));
            }
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          clearInterval(intervalId);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }
    },
    onRegisterError(error) {
      console.debug('Service Worker registration note:', error);
    },
  });

  // Never display PWA update banners in development mode (Vite HMR handles local updates)
  if (import.meta.env.DEV) {
    return null;
  }

  // Handle user choosing "Later" or closing the banner
  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(PWA_DISMISS_KEY, 'true');
  };

  const handleUpdateClick = () => {
    const isBusy = checkIsUserBusy();
    if (isBusy) {
      setShowConfirmModal(true);
    } else {
      executeReload();
    }
  };

  // Perform complete, guaranteed hard refresh and cache cleanup
  const executeReload = async () => {
    setIsUpdating(true);
    setShowConfirmModal(false);

    try {
      // Clear session dismissal key so fresh version starts clean
      sessionStorage.removeItem(PWA_DISMISS_KEY);

      // 1. Tell waiting service worker to skip waiting and activate
      if (typeof updateServiceWorker === 'function') {
        await updateServiceWorker(true);
      }

      // 2. Clear outdated precaches from CacheStorage to ensure 100% fresh assets
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(
          cacheKeys
            .filter((key) => key.includes('workbox') || key.includes('precache') || key.includes('trusthyre'))
            .map((key) => caches.delete(key))
        );
      }
    } catch (err) {
      console.warn('PWA update execution notice:', err);
    }

    // 3. Guaranteed complete hard reload
    setTimeout(() => {
      window.location.href = window.location.pathname + window.location.search;
      window.location.reload();
    }, 250);
  };

  if (!needRefresh || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Hallmark Update Pill Banner */}
      <div 
        role="alert"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] bg-white text-[#0a0a0a] rounded-2xl p-4 sm:p-5 border border-[#e6e8ec] shadow-2xl font-['Onest',system-ui,sans-serif] animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0f2f63] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#FACD15] animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0f2f63]">
                Update Ready
              </p>
            </div>
            <h4 className="text-sm font-bold text-[#0a0a0a] mt-0.5 leading-snug">
              A new version of TrustHyre is ready
            </h4>
            <p className="text-xs text-[#717784] mt-1 leading-relaxed">
              Refresh now to get the latest features and security updates.
            </p>

            <div className="flex items-center gap-2.5 mt-3.5">
              <button
                type="button"
                onClick={handleUpdateClick}
                disabled={isUpdating}
                className="px-4 py-2 rounded-full bg-[#0f2f63] hover:bg-[#2563c9] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Update Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                disabled={isUpdating}
                className="px-3.5 py-2 rounded-full bg-[#f4f4f4] hover:bg-[#e6e8ec] text-[#717784] hover:text-[#0a0a0a] text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-[#717784] hover:text-[#0a0a0a] p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss update notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal if User has Active Unsaved Work */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#e6e8ec] shadow-2xl font-['Onest',system-ui,sans-serif] space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0a0a0a]">
                Unsaved Work Detected
              </h3>
              <p className="text-xs text-[#717784] mt-1.5 leading-relaxed">
                You appear to have active form inputs or ongoing actions on this page. Refreshing now will reload the page with the latest version.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-full border border-[#e6e8ec] hover:bg-[#f4f4f4] text-xs font-semibold uppercase text-[#0a0a0a] transition-colors cursor-pointer"
              >
                Keep Working
              </button>
              <button
                type="button"
                onClick={executeReload}
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-full bg-[#0f2f63] hover:bg-[#2563c9] text-xs font-semibold uppercase text-white transition-all shadow-sm cursor-pointer disabled:opacity-75 flex items-center gap-1.5"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Reloading...</span>
                  </>
                ) : (
                  <span>Reload & Update</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
