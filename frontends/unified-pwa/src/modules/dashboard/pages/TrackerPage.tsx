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
import { Loader2 } from 'lucide-react';
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

  const handlePreferencesSaved = (newPrefs: WorkerPreferences) => {
    refetchRecommendations();
  };

  const isProfileComplete = Boolean(profile?.bio && profile?.skills && profile?.location);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Top Header & Profile Status */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-neutral-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1F3F34] font-headline">
              Namaste, {profile?.fullName?.split(' ')[0] || user?.firstName || 'Professional'}!
            </h1>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active Member
            </span>
          </div>
          <p className="text-xs text-[#1F3F34]/60 font-medium mt-0.5">
            Hyperlocal workforce portal • Real-time job matching active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="px-3.5 py-2 bg-[#F5F4EF] hover:bg-neutral-200/70 text-[#1F3F34] rounded-lg text-xs font-bold border border-neutral-200 transition-all flex items-center gap-1.5 active:scale-98"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Job Preferences
          </button>
          <button
            onClick={() => navigate('/search')}
            className="px-4 py-2 bg-[#FACD15] text-[#1F3F34] rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-xs hover:brightness-105 active:scale-98 transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            Browse All Jobs
          </button>
        </div>
      </section>

      {/* Profile Completion & Preferences Prompt Banner */}
      <div className="bg-[#1F3F34] rounded-xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-[#FACD15]/20 flex items-center justify-center shrink-0 text-[#FACD15]">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">Smart Match Recommendations Active</h3>
              <span className="bg-[#FACD15] text-[#002117] text-[9px] font-black uppercase px-2 py-0.5 rounded-sm">
                AI Engine
              </span>
            </div>
            <p className="text-white/70 text-xs mt-0.5 max-w-xl">
              Jobs are dynamically ranked by your skills, desired rate, and maximum travel radius. Keep your preferences updated for optimal job offers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="bg-[#FACD15] text-[#1F3F34] px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-xs"
          >
            Update Preferences
          </button>
          {!isProfileComplete && (
            <button
              onClick={() => navigate('/profile')}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg font-bold text-xs border border-white/20 transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <StatsSection 
        trustScore={stats?.trustScore || profile?.trustScore || 85} 
        nearbyJobs={allJobs.length || recommendedJobs.length} 
        earnings={stats?.appliedJobs ? `₹${(stats.appliedJobs * 1200).toLocaleString()}` : "₹0"} 
      />

      {/* Main Grid: Recommended Jobs & Progress/Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Recommended Jobs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#1F3F34] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#FACD15] rounded-full"></span>
                  Recommended Jobs for You
                </h2>
                <p className="text-[11px] text-[#1F3F34]/50 font-medium">Curated based on your skill set and location</p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="text-xs font-bold text-[#1F3F34] hover:underline flex items-center gap-1"
              >
                View all ({allJobs.length})
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {recLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#1F3F34]/30" />
              </div>
            ) : recommendedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedJobs.slice(0, 4).map((job: RecommendedJob) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="p-4 rounded-xl border border-neutral-200/80 hover:border-[#FACD15] hover:shadow-sm transition-all cursor-pointer bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {job.matchPercentage}% Match
                        </span>
                        <span className="text-xs font-black text-[#1F3F34] bg-neutral-100 px-2 py-0.5 rounded-md">
                          ₹{job.budget?.toLocaleString() || 'Negotiable'}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-[#1F3F34] group-hover:text-[#2d5f4f] transition-colors leading-tight line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-[#1F3F34]/60 font-medium mt-0.5">
                        {job.employerName || 'Verified Employer'}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-[#1F3F34]/50 mt-2 font-medium">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          {job.city || 'Nearby'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">work</span>
                          {job.industry || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-emerald-700 font-semibold truncate max-w-[180px]">
                        {job.matchReasons[0] || 'Good skill fit'}
                      </span>
                      <span className="text-[#1F3F34] font-bold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                        Apply
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#F5F4EF]/50 rounded-xl border border-dashed border-neutral-300">
                <span className="material-symbols-outlined text-neutral-400 text-3xl mb-1">work_off</span>
                <p className="text-xs font-bold text-[#1F3F34]/70">No matching jobs currently</p>
                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="mt-2 text-xs font-bold text-[#1F3F34] underline hover:text-[#FACD15]"
                >
                  Adjust your search preferences
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold text-[#1F3F34] flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#FACD15] rounded-full"></span>
                Recent Activity & Applications
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F3F34]/50">
                {myApplications.length} active applications
              </span>
            </div>

            <div className="space-y-2.5">
              {activitiesLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-[#1F3F34]/20" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-[#FAF9F4]/40 hover:bg-white transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-[#1F3F34]/70">
                        <span className="material-symbols-outlined text-base">
                          {activity.type === 'JOB_APPLIED' ? 'description' : 'notifications'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1F3F34] leading-tight">{activity.description}</p>
                        <p className="text-[10px] text-[#1F3F34]/40">{new Date(activity.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-600">
                      {activity.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs font-medium text-neutral-400">
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
