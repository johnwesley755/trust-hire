import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../../services/profile.service';
import { jobService } from '../../../services/job.service'; 
import { applicationService } from '../../../services/application.service';
import { dashboardService } from '../../../services/dashboard.service';
import { recommendationService, type RecommendedJob } from '../../../services/recommendation.service';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../../../providers/AuthContext';

// Modular Components
import { StatsSection } from '../components/StatsSection';
import { ProgressSidePanel } from '../components/ProgressSidePanel';
import { PreferencesModal, type WorkerPreferences } from '../../profile/components/PreferencesModal';
import { Loader2, Zap, Sparkles, SlidersHorizontal, MapPin, Briefcase, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function TrackerPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: stats } = useQuery({
    queryKey: ['workerStats'],
    queryFn: dashboardService.getWorkerStats,
  });

  const { data: allJobs = [] } = useQuery({
    queryKey: ['allOpenJobs'],
    queryFn: jobService.getAllJobs,
    staleTime: 60000,
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
    staleTime: 60000,
  });

  const { data: recommendedJobs = [], isLoading: recLoading, refetch: refetchRecommendations } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: () => recommendationService.getRecommendedJobs(),
    staleTime: 30000,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
        const res = await apiClient.get('/api/activities/recent?limit=5');
        return Array.isArray(res.data) ? res.data : [];
    }
  });

  const handlePreferencesSaved = (_newPrefs: WorkerPreferences) => {
    refetchRecommendations();
  };

  const isProfileComplete = Boolean(profile?.bio && profile?.skills && profile?.location);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Header & Profile Status */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0A1931] tracking-tight">
              Welcome back, {profile?.fullName?.split(' ')[0] || user?.firstName || 'Partner'}! 👋
            </h1>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Partner
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Hyperlocal partner hub • Real-time instant shift matching active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0066FF]" />
            Job Preferences
          </button>
          <button
            onClick={() => navigate('/search')}
            className="px-4 py-2 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            Browse Shifts
          </button>
        </div>
      </section>

      {/* Smart Match AI Banner */}
      <div className="bg-gradient-to-r from-[#0066FF] to-[#0A1931] rounded-2xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md shadow-blue-900/10 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white">Smart Match Recommendations Active</h3>
              <span className="bg-amber-400 text-slate-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
                Live AI
              </span>
            </div>
            <p className="text-blue-100/80 text-xs mt-0.5 max-w-xl">
              Shifts are dynamically ranked by your skills, hourly rate, and radius. Guaranteed escrow payout upon completion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            Set Match Radius
          </button>
          {!isProfileComplete && (
            <button
              onClick={() => navigate('/profile')}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Complete Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <StatsSection 
        nearbyJobs={allJobs.length || recommendedJobs.length} 
        earnings={stats?.appliedJobs ? `₹${(stats.appliedJobs * 1200).toLocaleString()}` : "₹0"} 
        completedShifts={myApplications.filter(a => a.status === 'HIRED' || a.status === 'COMPLETED' || a.status === 'ACCEPTED').length}
      />

      {/* Main Grid: Recommended Jobs & Progress/Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Recommended Jobs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#0066FF] rounded-full"></span>
                  Top Recommended Shifts for You
                </h2>
                <p className="text-xs text-slate-400 font-medium">Ranked by proximity and your verified skill profile</p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all ({allJobs.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#0066FF]" />
              </div>
            ) : recommendedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedJobs.slice(0, 4).map((job: RecommendedJob) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {job.matchPercentage}% Match
                        </span>
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          ₹{job.budget?.toLocaleString() || 'Negotiable'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors leading-tight line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#0066FF]" />
                        {job.employerName || 'Verified Enterprise Partner'}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
                        <span className="flex items-center gap-0.5 text-slate-600">
                          <MapPin className="w-3 h-3 text-[#0066FF]" />
                          {job.city || '1.2 km away'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Briefcase className="w-3 h-3" />
                          {job.industry || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-[180px]">
                        {job.matchReasons[0] || 'Top Skill Fit'}
                      </span>
                      <span className="text-[#0066FF] font-bold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                        Apply Now
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-600">No matching jobs currently</p>
                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="mt-2 text-xs font-bold text-[#0066FF] underline hover:text-blue-700"
                >
                  Adjust your search preferences
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#0066FF] rounded-full"></span>
                Recent Shifts & Applications
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {myApplications.length} active applications
              </span>
            </div>

            <div className="space-y-2">
              {activitiesLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-[#0066FF]" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-tight">{activity.description}</p>
                        <p className="text-[10px] text-slate-400">{new Date(activity.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                      {activity.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs font-medium text-slate-400">
                  No recent activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Progress & Level Panel */}
        <div className="lg:col-span-4 space-y-4">
          <ProgressSidePanel level={profile?.level} progress={75} />
        </div>
      </div>

      {/* Preferences Modal Dialog */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={handlePreferencesSaved}
      />
    </div>
  );
}

