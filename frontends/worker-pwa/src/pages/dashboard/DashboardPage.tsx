import { useAppDispatch, useAppSelector } from '../../store';
import { fetchProfile } from '../../store/slices/profileSlice';
import { searchJobs, fetchMyApplications } from '../../store/slices/jobSlice';
import { fetchWorkerStats, fetchRecentActivities } from '../../store/slices/dashboardSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// New Modular Components
import { StatsSection } from '../../components/dashboard/StatsSection';
import { JobBentoCard, FeaturedJobCard } from '../../components/dashboard/JobBentoCard';
import { ProgressSidePanel } from '../../components/dashboard/ProgressSidePanel';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);
  const { jobs, appliedJobs } = useAppSelector((state) => state.jobs);
  const { stats, activities, loading: activitiesLoading } = useAppSelector((state) => state.dashboard);
  
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchWorkerStats());
    dispatch(fetchRecentActivities(5));
    dispatch(fetchMyApplications());
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, [dispatch]);

  useEffect(() => {
    const searchLocation = profile?.city || profile?.address || profile?.location || '';
    dispatch(searchJobs({ 
      query: '', 
      category: '', 
      location: searchLocation, 
      lat: coords?.lat, 
      lon: coords?.lon 
    }));
  }, [dispatch, profile, coords]);

  const appliedJobIds = new Set(appliedJobs?.map((app: any) => app.jobId) || []);
  console.log('Jobs with applications:', appliedJobIds.size);

  const visibleJobs = jobs.map((job: any) => ({
        id: job.jobId || job.id,
        title: job.title,
        description: job.description,
        location: job.location || job.city || job.address,
        budget: Number(job.budget || job.salary || 0),
        industry: job.industry || job.category,
        isApplied: job.isApplied || appliedJobIds.has(job.jobId || job.id)
      }));

  const totalEarnings = visibleJobs.reduce((acc, job) => acc + (job.budget || 0), 0);
  const formattedEarnings = `₹${(totalEarnings / 10).toLocaleString()}`; // Scaling for realism in demo

  return (
    <div className="p-4 md:p-8 pr-8 lg:pr-16 w-full relative">
      {/* Greeting Section */}
      <section className="mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F3F34]">Namaste, {profile?.fullName?.split(' ')[0] || 'Professional'}!</h2>
            <p className="text-[#1F3F34]/60 font-medium tracking-tight">Ready for today's tasks? Here's your overview.</p>
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-[#c1c8c3]/20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F3F34]">Online</span>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <StatsSection 
        trustScore={stats?.trustScore || profile?.trustScore || 0} 
        nearbyJobs={visibleJobs.length} 
        earnings={stats?.appliedJobs ? `₹${(stats.appliedJobs * 1200).toLocaleString()}` : "₹0"} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content: Recommended Jobs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#1F3F34] flex items-center gap-2 tracking-tight">
              <span className="w-2 h-6 bg-[#FACD15] rounded-full"></span>
              Recommended For You
            </h2>
            <button 
              onClick={() => navigate('/search')}
              className="text-xs font-bold text-[#414845] hover:text-[#1F3F34] transition-colors uppercase tracking-widest"
            >
              View All Jobs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleJobs.length > 0 ? (
              <>
                {/* First Job as Featured */}
                <FeaturedJobCard 
                  job={visibleJobs[0]} 
                  onApply={() => navigate(`/job/${visibleJobs[0].id}`)} 
                  onClick={() => navigate(`/job/${visibleJobs[0].id}`)} 
                />
                {/* Remaining Jobs as Bento Cards */}
                {visibleJobs.slice(1).map((job) => (
                  <JobBentoCard 
                    key={job.id} 
                    job={job} 
                    onApply={() => navigate(`/job/${job.id}`)} 
                    onClick={() => navigate(`/job/${job.id}`)} 
                  />
                ))}
              </>
            ) : (
                <div className="col-span-full py-20 bg-white rounded-[2rem] border-2 border-dashed border-[#c1c8c3]/30 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-[#f5f4ef] rounded-full flex items-center justify-center text-[#414845]/30">
                    <span className="material-symbols-outlined text-4xl">search_off</span>
                  </div>
                  <h4 className="font-extrabold text-[#1F3F34]">No matching jobs yet</h4>
                  <p className="text-sm text-[#414845] max-w-xs mx-auto">Try updating your skills or expanding your location preferences.</p>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="text-[0.65rem] font-extrabold uppercase text-[#1F3F34] bg-[#FACD15] px-6 py-2 rounded-full hover:shadow-lg transition-all active:scale-95"
                  >
                    Update Profile
                  </button>
                </div>
            )}
          </div>

          <div className="bg-[#EFEEE9] p-8 rounded-[2rem] border-2 border-dashed border-[#c1c8c3]/30 flex flex-col items-center justify-center text-center space-y-4 mt-8">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#414845]">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <div>
              <h4 className="font-extrabold text-[#1F3F34]">Need more options?</h4>
              <p className="text-sm text-[#414845] max-w-xs mx-auto">Your next big opportunity might be just a click away.</p>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="text-[0.65rem] font-extrabold uppercase text-[#1F3F34] bg-white px-6 py-2 rounded-full hover:bg-[#FACD15] transition-all border border-[#c1c8c3]/20"
            >
              Explore Job Marketplace
            </button>
          </div>
        </div>

        {/* Right Sidebar: Progress & Actions */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <ProgressSidePanel level={profile?.level} progress={75} />
          
          {/* Recent Activity Card */}
          <div className="bg-white rounded-[2rem] p-6 border border-[#EFEEE9] shadow-sm">
            <div className="flex justify-between items-center mb-6 px-1">
              <h4 className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Recent Activity</h4>
              <span className="w-2 h-2 bg-[#FACD15] rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1F3F34]/20" />
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-2xl border border-dashed border-[#EFEEE9] group hover:border-[#FACD15] transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-[#EFEEE9]/50 flex items-center justify-center group-hover:bg-[#FACD15]/10 transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[#1F3F34]/40 group-hover:text-[#1F3F34]">
                        {activity.type === 'JOB_APPLIED' ? 'description' : 
                         activity.type === 'APPLICATION_STATUS_CHANGED' ? 'notifications_active' : 'history'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-black text-[#1F3F34] leading-tight mb-1">{activity.description}</p>
                      <p className="text-[9px] font-bold text-[#1F3F34]/30 uppercase tracking-tighter">{activity.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[10px] font-bold text-[#1F3F34]/20 uppercase tracking-widest">No recent activity</p>
                </div>
              )}
              <button className="w-full py-3 text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest hover:text-[#1F3F34] transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
