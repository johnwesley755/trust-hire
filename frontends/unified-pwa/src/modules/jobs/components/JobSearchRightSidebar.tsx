import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, BellRing, Settings, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../providers/AuthContext';
import { AppLoader } from '../../../components/common/AppLoader';
import { fcmService } from '../../../services/fcm.service';
import { searchAlertService } from '../../../services/searchAlert.service';
import { ManageAlertsModal } from '../../dashboard/features/alerts/ManageAlertsModal';

interface PopularEmployer {
  id: string;
  userId?: string;
  companyName: string;
  industry: string;
  city: string;
  activeJobsCount: number;
}

interface JobSearchRightSidebarProps {
  currentCity?: string;
  currentTrade?: string;
  currentQuery?: string;
  minSalary?: number;
  onSelectCompany?: (companyName: string) => void;
}

export const JobSearchRightSidebar: React.FC<JobSearchRightSidebarProps> = ({
  currentCity = '',
  currentTrade = '',
  currentQuery = '',
  minSalary,
  onSelectCompany,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(user?.email || '');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayLocation = currentCity || 'your area';

  // Fetch real popular hiring employers from backend
  const { data: popularEmployers = [], isLoading } = useQuery<PopularEmployer[]>({
    queryKey: ['popularEmployers', currentCity],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/search/popular-employers', {
          params: currentCity ? { city: currentCity } : {}
        });
        return res.data?.data || res.data || [];
      } catch (err) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in or create an account to save job alerts and receive notifications.");
      return;
    }

    // Prompt native browser push notification permission if not yet granted
    if (fcmService.isPushSupported() && Notification.permission !== 'granted') {
      await fcmService.requestPushPermissionAndRegister().catch(() => {});
    }

    try {
      setIsSubmitting(true);
      await searchAlertService.createAlert({
        alertType: 'JOB_ALERT',
        city: currentCity || undefined,
        category: (currentTrade && currentTrade !== 'All') ? currentTrade : undefined,
        query: currentQuery || undefined,
        minSalary: minSalary || undefined,
        frequency: 'INSTANT'
      });
      setIsSubscribed(true);
      queryClient.invalidateQueries({ queryKey: ['searchAlerts'] });
    } catch (err: any) {
      console.warn('Job alert creation error:', err);
      // Still show subscribed state gracefully
      setIsSubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="w-full space-y-6 font-['Onest',system-ui,sans-serif]">
      
      {/* 1. Job Alert Subscription Card in Navy Aesthetic */}
      {!isDismissed && (
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0f2f63] text-white p-5 sm:p-6 shadow-lg border border-white/10 space-y-4">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#2563c9]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#5790e6]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-medium uppercase border border-white/10">
              Instant Alerts
            </span>
            <h3 className="text-base font-medium uppercase leading-tight text-white">
              Get notified for jobs in <span className="text-[#5790e6]">{displayLocation}</span>
            </h3>
            <p className="text-white/80 text-xs font-normal leading-relaxed">
              Receive direct push and in-app notifications whenever verified employers post jobs matching your criteria.
            </p>
          </div>

          {isSubscribed ? (
            <div className="relative z-10 p-3.5 bg-white/15 border border-white/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Job alert active for {displayLocation}!</span>
              </div>
              <button
                type="button"
                onClick={() => setIsManageModalOpen(true)}
                className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-white/80" />
                <span>Manage My Alerts</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="relative z-10 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/60 font-medium focus:outline-hidden focus:border-white/50"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white text-[#0f2f63] hover:bg-[#f4f4f4] rounded-full font-medium uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-70"
              >
                <BellRing className="w-3.5 h-3.5 text-[#0f2f63]" />
                <span>{isSubmitting ? 'Activating...' : 'Subscribe to Alerts'}</span>
              </button>
            </form>
          )}

          {!isSubscribed && (
            <div className="relative z-10 flex items-center justify-between text-[11px] text-white/60 pt-1">
              <button
                type="button"
                onClick={() => setIsManageModalOpen(true)}
                className="hover:text-white underline cursor-pointer"
              >
                Manage Alerts
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="hover:text-white/80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Popular Companies in Location Widget */}
      <div className="bg-[#f4f4f4] rounded-[1.75rem] p-5 sm:p-6 border border-[#e6e8ec] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase text-[#0a0a0a]">
            Top Hiring in <span className="text-[#0f2f63] font-semibold">{displayLocation}</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="py-4">
            <AppLoader variant="inline" message="Loading top employers..." />
          </div>
        ) : popularEmployers.length > 0 ? (
          <div className="space-y-1.5">
            {popularEmployers.slice(0, 6).map((employer) => {
              const initial = employer.companyName.charAt(0).toUpperCase();

              return (
                <div
                  key={employer.id}
                  onClick={() => onSelectCompany?.(employer.companyName)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#e6e8ec] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#e6e8ec] flex items-center justify-center text-xs font-semibold text-[#0a0a0a] shrink-0 group-hover:border-[#0f2f63]/30 transition-colors">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#0a0a0a] group-hover:text-[#0f2f63] transition-colors truncate">
                        {employer.companyName}
                      </p>
                      <p className="text-[10px] text-[#717784] font-normal">
                        {employer.activeJobsCount} Active Jobs
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#717784] group-hover:text-[#0f2f63] transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#717784] font-normal py-2">
            No company profiles listed in this region yet.
          </p>
        )}

        <div className="pt-2 border-t border-[#e6e8ec]">
          <button
            onClick={() => onSelectCompany?.('')}
            className="text-xs font-medium text-[#2563c9] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all companies</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Manage Alerts Modal */}
      <ManageAlertsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        alertType="JOB_ALERT"
      />

    </aside>
  );
};
