import { useQuery } from '@tanstack/react-query';
import { searchJobs } from '../../../services/search.service';
import { profileService } from '../../../services/profile.service';
import { jobService } from '../../../services/job.service'; 
import { applicationService } from '../../../services/application.service';
import { dashboardService } from '../../../services/dashboard.service';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../../providers/AuthContext';

// New Modular Components
import { StatsSection } from '../components/StatsSection';
import { ProgressSidePanel } from '../components/ProgressSidePanel';
import { Loader2 } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export default function TrackerPage() {

  const navigate = useNavigate();
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: stats } = useQuery({
    queryKey: ['workerStats'],
    queryFn: dashboardService.getWorkerStats,
  });

  const searchLocation = profile?.city || profile?.address || profile?.location || '';

  const { data: jobs } = useQuery({ 
    queryKey: ['nearbyJobs', searchLocation, coords], 
    queryFn: () => searchJobs('', '', searchLocation, undefined, coords?.lat, coords?.lon, 50),
    enabled: !!profile,
    staleTime: 60000 
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

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
        const res = await apiClient.get('/api/activities/recent?limit=5');
        return res.data.data;
    }
  });

  const appliedJobIds = new Set(myApplications.map((app) => app.jobId));
  console.log('Jobs with applications:', appliedJobIds.size);

  return (
    <div className="p-4 md:p-8 pr-8 lg:pr-16 w-full relative">
      {/* Greeting Section */}
      <section className="mb-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F3F34]">Namaste, {profile?.fullName?.split(' ')[0] || 'Professional'}!</h2>
              {user?.identity_verified ? (
                <div className="bg-emerald-500 text-white p-0.5 rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
              ) : (
                <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 shrink-0">Unverified</span>
              )}
            </div>
            <p className="text-[#1F3F34]/60 font-medium tracking-tight">Ready for today's tasks? Here's your overview.</p>
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-[#c1c8c3]/20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F3F34]">Online</span>
          </div>
        </div>

        {/* Verification Prompt Banner */}
        {!user?.identity_verified && (
          <div className="mt-8 bg-[#1F3F34] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl shadow-[#1F3F34]/20 group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#FACD15] text-3xl font-bold">verified_user</span>
              </div>
              <div className="text-left">
                <h3 className="text-[#F5F4EF] text-xl font-black uppercase tracking-tight">Get Your Verified Badge</h3>
                <p className="text-[#F5F4EF]/60 text-sm font-medium max-w-md mt-1 leading-snug">
                  Verified workers are 4x more likely to get hired. Complete your identity check to earn the green tick of trust.
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/verify-identity')}
              className="bg-[#FACD15] text-[#1F3F34] px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-[#FACD15]/20 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 shrink-0 relative z-10"
            >
              Verify Now
            </button>
          </div>
        )}
      </section>

      {/* Stats Row */}
      <StatsSection 
        trustScore={stats?.trustScore || profile?.trustScore || 0} 
        nearbyJobs={allJobs.length} 
        earnings={stats?.appliedJobs ? `₹${(stats.appliedJobs * 1200).toLocaleString()}` : "₹0"} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Progress Panel */}
        <div className="lg:col-span-4 space-y-6">
          <ProgressSidePanel level={profile?.level} progress={75} />
        </div>

        {/* Recent Activity Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 lg:p-10 border border-[#EFEEE9] shadow-sm">
            <div className="flex justify-between items-center mb-8 px-1">
              <div>
                <h2 className="text-xl font-extrabold text-[#1F3F34] flex items-center gap-2 tracking-tight">
                  <span className="w-2 h-6 bg-[#FACD15] rounded-full"></span>
                  Recent Activity
                </h2>
                <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest mt-1">Timeline of your engagements</p>
              </div>
              <span className="w-3 h-3 bg-[#FACD15] rounded-full animate-pulse shadow-[0_0_10px_rgba(250,205,21,0.5)]"></span>
            </div>
            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1F3F34]/20" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-dashed border-[#EFEEE9] group hover:border-[#FACD15] transition-colors cursor-pointer bg-white">
                    <div className="w-12 h-12 rounded-xl bg-[#EFEEE9]/50 flex items-center justify-center group-hover:bg-[#FACD15]/10 transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[#1F3F34]/40 group-hover:text-[#1F3F34] text-xl">
                        {activity.type === 'JOB_APPLIED' ? 'description' : 
                         activity.type === 'APPLICATION_STATUS_CHANGED' ? 'notifications_active' : 'history'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1F3F34]/40 uppercase tracking-widest mb-1">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-black text-[#1F3F34] leading-tight mb-1">{activity.description}</p>
                      <p className="text-[10px] font-bold text-[#1F3F34]/30 uppercase tracking-tighter">{activity.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-[#EFEEE9]/30 rounded-2xl border-2 border-dashed border-[#1F3F34]/10">
                  <span className="material-symbols-outlined text-[#1F3F34]/20 text-4xl mb-2">history</span>
                  <p className="text-sm font-bold text-[#1F3F34]/40 tracking-tight">No recent activity</p>
                  <p className="text-[10px] font-bold text-[#1F3F34]/30 uppercase tracking-widest mt-1">Start applying to jobs to build your timeline</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
