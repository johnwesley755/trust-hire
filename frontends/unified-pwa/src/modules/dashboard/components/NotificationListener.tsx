import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bell, CheckCircle2, Info, AlertTriangle, Briefcase, Award, ShieldCheck, X } from 'lucide-react';
import { fcmService } from '../../../services/fcm.service';
import { useAuth } from '../../../providers/AuthContext';

export const NotificationListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPromptBanner, setShowPromptBanner] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (fcmService.isPushSupported()) {
      const currentPerm = Notification.permission;
      
      if (currentPerm === 'granted') {
        // Token refresh and keep alive
        fcmService.requestPushPermissionAndRegister().catch(() => {});
      } else if (currentPerm === 'default') {
        // 1. Attempt non-blocking auto-request after user has landed
        const autoTimer = setTimeout(() => {
          fcmService.requestPushPermissionAndRegister().then(res => {
            if (res.status === 'granted') {
              setShowPromptBanner(false);
            }
          }).catch(() => {});
        }, 1200);

        // 2. If not granted, display soft-ask banner unless dismissed in session
        const isDismissed = sessionStorage.getItem('trusthyre_push_prompt_dismissed') === 'true';
        if (!isDismissed) {
          setShowPromptBanner(true);
        }

        return () => clearTimeout(autoTimer);
      }
    }

    // 3. Attach real-time foreground listener for FCM push notifications
    let cleanupListener: (() => void) | null = null;

    fcmService.listenToForegroundMessages((payload) => {
      // Invalidate TanStack query cache immediately to refresh bell badge count in real time
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

      const title = payload.notification?.title || payload.data?.title || 'TrustHyre Notification';
      const message = payload.notification?.body || payload.data?.body || payload.data?.message || 'You have a new update.';
      const link = payload.data?.url || payload.data?.link || '/notifications';
      const type = (payload.data?.type || 'SYSTEM').toUpperCase();

      // Gentle vibration feedback on mobile devices
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([80, 40, 80]);
        } catch {
          // ignore
        }
      }

      // Display rich, actionable in-app toast with deep link navigation
      toast(title, {
        description: message,
        icon: getNotificationIcon(type),
        duration: 6000,
        className: "bg-[#FFFFFF] dark:bg-[#0f2f63] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-blue-900 shadow-xl p-4 font-sans",
        action: link ? {
          label: 'View',
          onClick: () => {
            navigate(link);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
          }
        } : undefined
      });
    }).then((unsub) => {
      cleanupListener = unsub;
    });

    return () => {
      if (cleanupListener) {
        cleanupListener();
      }
    };
  }, [user, queryClient, navigate]);

  const handleEnablePush = async () => {
    setIsRequesting(true);
    try {
      const result = await fcmService.requestPushPermissionAndRegister();
      if (result.status === 'granted') {
        toast.success("Push notifications enabled! You will receive real-time updates.", {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        });
        setShowPromptBanner(false);
      } else if (result.status === 'denied') {
        toast.error("Notification permission was denied. You can re-enable it in browser settings.");
        setShowPromptBanner(false);
      }
    } catch (err: any) {
      console.warn("Push permission request error:", err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismissBanner = () => {
    sessionStorage.setItem('trusthyre_push_prompt_dismissed', 'true');
    setShowPromptBanner(false);
  };

  return (
    <>
      {showPromptBanner && (
        <aside 
          aria-label="Notification Permission Prompt"
          className="fixed bottom-5 right-5 z-[9999] max-w-sm w-[calc(100vw-2.5rem)] bg-[#0f2f63] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/10 font-['Onest',system-ui,sans-serif] animate-in slide-in-from-bottom duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-[#5790e6] animate-bounce" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-sm font-bold text-white leading-tight">
                Turn on Push Notifications
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Get notified instantly about job applications, direct offers, and instant shift alerts even when away.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEnablePush}
                  disabled={isRequesting}
                  className="px-3.5 py-1.5 bg-white text-[#0f2f63] hover:bg-[#f4f4f4] rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-70"
                >
                  {isRequesting ? 'Enabling...' : 'Allow Notifications'}
                </button>
                <button
                  type="button"
                  onClick={handleDismissBanner}
                  className="px-3 py-1.5 text-white/70 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissBanner}
              className="text-white/50 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
};

const getNotificationIcon = (type?: string) => {
  const t = (type || '').toUpperCase();
  if (t === 'APPLICATION_ACCEPTED' || t === 'NEW_APPLICATION' || t === 'APPLICATION_SUBMITTED') {
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  }
  if (t === 'JOB_MATCH_ALERT' || t === 'JOB_POSTED') {
    return <Briefcase className="w-5 h-5 text-blue-500" />;
  }
  if (t === 'SKILL_BADGE_EARNED') {
    return <Award className="w-5 h-5 text-amber-500" />;
  }
  if (t === 'KYC_VERIFIED' || t === 'SECURITY_ALERT') {
    return <ShieldCheck className="w-5 h-5 text-blue-600" />;
  }
  if (t === 'KYC_REJECTED' || t === 'WARNING') {
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  }
  if (t === 'INFO' || t === 'APPLICATION_UPDATE') {
    return <Info className="w-5 h-5 text-blue-400" />;
  }
  return <Bell className="w-5 h-5 text-[#0F2F63] dark:text-white" />;
};
