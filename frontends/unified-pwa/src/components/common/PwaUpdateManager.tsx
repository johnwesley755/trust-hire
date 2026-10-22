import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Sparkles, X, AlertTriangle, Loader2 } from 'lucide-react';
import { checkIsUserBusy } from '../../hooks/useUserActivityGuard';
import { APP_VERSION } from '../../version';

export const PwaUpdateManager: React.FC = () => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [availableVersion, setAvailableVersion] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // In development mode on localhost, unregister any stale workbox service workers
  useEffect(() => {
    if (import.meta.env.DEV && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          if (!reg.active?.scriptURL.includes('firebase-messaging-sw.js')) {
            reg.unregister().catch(() => {});
          }
        });
      });
    }
  }, []);

  // Check version.json on server and compare strictly with APP_VERSION
  const checkVersionJson = useCallback(async () => {
    if (import.meta.env.DEV) return;
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const remoteVersion = data?.version;

      // STRICT CHECK: Only trigger if remoteVersion exists and is DIFFERENT from APP_VERSION
      if (remoteVersion && typeof APP_VERSION === 'string' && remoteVersion !== APP_VERSION) {
        // Check if the user has already dismissed or updated this specific version in localStorage
        const isDismissed = localStorage.getItem(`trusthyre_dismissed_version_${remoteVersion}`) === 'true';
        if (!isDismissed) {
          setAvailableVersion(remoteVersion);
          setHasUpdate(true);
        } else {
          setHasUpdate(false);
        }
      } else {
        // Same version or invalid data -> ensure banner is closed
        setHasUpdate(false);
      }
    } catch {
      // Network failure or offline -> ignore silently
    }
  }, []);

  // Polling checks on mount, visibility changes, and every 3 minutes
  useEffect(() => {
    // 1. Initial check after a brief 2-second delay
    const initialTimer = setTimeout(() => {
      checkVersionJson();
    }, 2000);

    // 2. Periodic polling every 3 minutes
    const intervalId = setInterval(() => {
      checkVersionJson();
    }, 3 * 60 * 1000);

    // 3. Tab visibility change check
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkVersionJson();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkVersionJson]);

  // Handle user clicking "Later" or "X" (close)
  // Persists in localStorage so the user is NEVER asked again for this version
  const handleDismiss = () => {
    if (availableVersion) {
      localStorage.setItem(`trusthyre_dismissed_version_${availableVersion}`, 'true');
    }
    setHasUpdate(false);
  };

  const handleUpdateClick = () => {
    const isBusy = checkIsUserBusy();
    if (isBusy) {
      setShowConfirmModal(true);
    } else {
      executeReload();
    }
  };

  // Perform 100% no-cache complete hard refresh (mimics Ctrl+Shift+R)
  const executeReload = async () => {
    setIsUpdating(true);
    setShowConfirmModal(false);

    // Persist acknowledgement for this version in localStorage so it never asks again
    if (availableVersion) {
      localStorage.setItem(`trusthyre_dismissed_version_${availableVersion}`, 'true');
    }

    try {
      // 1. Clear ALL browser CacheStorage (workbox, precache, runtime assets)
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((name) => caches.delete(name)));
      }

      // 2. Unregister application service workers so fresh files are loaded
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(async (reg) => {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            if (!reg.active?.scriptURL.includes('firebase-messaging-sw.js')) {
              return reg.unregister();
            }
          })
        );
      }
    } catch (err) {
      console.warn('Cache clearing during update notice:', err);
    }

    // 3. Cache-busting complete hard reload
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('_v', Date.now().toString());
      window.location.replace(url.toString());

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 200);
  };

  if (!hasUpdate || !availableVersion) {
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
                Update Ready (v{availableVersion})
              </p>
            </div>
            <h4 className="text-sm font-bold text-[#0a0a0a] mt-0.5 leading-snug">
              A new version of TrustHyre is available
            </h4>
            <p className="text-xs text-[#717784] mt-1 leading-relaxed">
              Refresh now to load the latest features, security updates, and bug fixes without cached files.
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
