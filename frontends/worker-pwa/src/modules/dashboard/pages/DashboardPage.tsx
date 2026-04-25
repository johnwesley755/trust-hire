import { useQuery } from '@tanstack/react-query';
import { searchJobs } from '../../jobs/api/search.service';
import { profileService } from '../../profile/api/profile.service';
import { jobService } from '../../jobs/api/job.service';
import { applicationService } from '../../jobs/api/application.service';
import { dashboardService } from '../api/dashboard.service';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../core/hooks/useLanguage';
import { useState, useEffect } from 'react';

// New Modular Components
import { StatsSection } from '../components/StatsSection';
import { JobBentoCard, FeaturedJobCard } from '../components/JobBentoCard';
import { ProgressSidePanel } from '../components/ProgressSidePanel';

export default function DashboardPage() {
  const navigate = useNavigate();
  useLanguage();
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

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

  const appliedJobIds = new Set(myApplications.map((app) => app.jobId));
  console.log('Jobs with applications:', appliedJobIds.size);

  const visibleJobs = (jobs && jobs.length > 0)
    ? jobs.map((job) => ({
        id: job.jobId,
        title: job.title,
        location: job.location,
        budget: Number(job.budget),
        industry: job.industry,
        isApplied: job.isApplied || appliedJobIds.has(job.jobId)
      }))
    : allJobs
        .filter((job) => job.status === 'OPEN')
        .slice(0, 4)
        .map((job) => ({
          id: job.id || '',
          title: job.title,
          location: job.city || job.address || job.location,
          budget: Number(job.budget),
          industry: job.industry,
          isApplied: (job as any).isApplied || appliedJobIds.has(job.id || '')
        }));

  // Map earnings from job statistics or mock for design
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
                />
                {/* Remaining Jobs as Bento Cards */}
                {visibleJobs.slice(1).map((job) => (
                  <JobBentoCard 
                    key={job.id} 
                    job={job} 
                    onApply={() => navigate(`/job/${job.id}`)} 
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
        </div>
      </div>
    </div>
  );
}
