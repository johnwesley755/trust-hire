import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bell, CheckCircle2, Info, AlertTriangle, Briefcase, Award, ShieldCheck, Users } from 'lucide-react';
import { fcmService } from '../../../services/fcm.service';
import { useAuth } from '../../../providers/AuthContext';

export const NotificationListener = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (fcmService.isPushSupported()) {
      const currentPerm = Notification.permission;
      console.log(`\n🎧 [NotificationListener] Mounting listener for user: ${user.id} (${user.email || 'user'}). Browser permission: ${currentPerm}`);
      
      if (currentPerm === 'granted') {
        // Token refresh and keep alive with active user ID
        fcmService.requestPushPermissionAndRegister(user.id).catch(() => {});
      }
    }

    // Attach real-time foreground listener for FCM push notifications
    let cleanupListener: (() => void) | null = null;

    fcmService.listenToForegroundMessages((payload) => {
      // Invalidate TanStack query cache immediately to refresh bell badge count in real time
      console.log('🔄 [FCM-CLIENT:STEP-9:CACHE-INVALIDATION] Invalidating notification queries in TanStack cache...');
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
        action: {
          label: 'View',
          onClick: () => {
            let targetLink = link || '/notifications';
            if (targetLink.includes('/dashboard/employer/jobs')) {
              const match = targetLink.match(/\/dashboard\/employer\/jobs\/([^\/]+)/);
              if (match && match[1] && match[1] !== 'applicants') {
                targetLink = `/jobs/${match[1]}/applicants`;
              } else {
                targetLink = '/jobs';
              }
            }
            navigate(targetLink);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
          }
        }
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

  return null;
};

const getNotificationIcon = (type?: string) => {
  const t = (type || '').toUpperCase();
  if (t === 'APPLICATION_ACCEPTED' || t === 'NEW_APPLICATION' || t === 'APPLICATION_SUBMITTED') {
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  }
  if (t === 'JOB_MATCH_ALERT' || t === 'JOB_POSTED') {
    return <Briefcase className="w-5 h-5 text-blue-500" />;
  }
  if (t === 'CANDIDATE_MATCH_ALERT' || t === 'CANDIDATE_ALERT') {
    return <Users className="w-5 h-5 text-indigo-500" />;
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
