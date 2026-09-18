import React, { useState } from 'react';
import { Mail, CheckCircle2, ChevronRight, Building2, BellRing } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../providers/AuthContext';
import { AppLoader } from '../../../components/common/AppLoader';

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
  onSelectCompany?: (companyName: string) => void;
}

export const JobSearchRightSidebar: React.FC<JobSearchRightSidebarProps> = ({
  currentCity = '',
  onSelectCompany,
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <aside className="w-full space-y-6 font-sans">
      
      {/* 1. Job Alert Subscription Card */}
      {!isDismissed && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
          <div>
            <h3 className="text-sm font-extrabold text-[#0A1931] font-['Outfit',sans-serif] leading-snug">
              Be the first to see new jobs in{' '}
              <span className="text-[#0066FF]">{displayLocation}</span>
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-1">
              Receive instant alerts for matching shifts & full-time roles.
            </p>
          </div>

          {isSubscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Subscribed to {displayLocation} job alerts!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer font-['Outfit',sans-serif]"
              >
                Subscribe Now
              </button>
            </form>
          )}

          {!isSubscribed && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Not interested. Hide now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Popular Companies in Location Widget */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#0A1931] font-['Outfit',sans-serif]">
            Popular in <span className="text-[#0066FF]">{displayLocation}</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="py-4">
            <AppLoader variant="inline" message="Loading top employers..." />
          </div>
        ) : popularEmployers.length > 0 ? (
          <div className="space-y-2.5">
            {popularEmployers.slice(0, 6).map((employer) => {
              const initial = employer.companyName.charAt(0).toUpperCase();

              return (
                <div
                  key={employer.id}
                  onClick={() => onSelectCompany?.(employer.companyName)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-800 shrink-0 group-hover:bg-blue-50 group-hover:text-[#0066FF] transition-all">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors truncate">
                        {employer.companyName}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {employer.activeJobsCount} Jobs Available
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0066FF] transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium py-2">
            No company profiles listed in this region yet.
          </p>
        )}

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => onSelectCompany?.('')}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See all jobs</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </aside>
  );
};
