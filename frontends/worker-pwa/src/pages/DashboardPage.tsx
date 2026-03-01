import { UserButton } from "@clerk/clerk-react";
import { ProfileCard, ActionGrid, BottomNav } from '../features/dashboard/DashboardComponents';
import { useQuery } from '@tanstack/react-query';
import { searchJobs } from '../api/search.service';
import { profileService } from '../api/profile.service';
import { useNavigate } from 'react-router-dom';

import { NotificationCenter } from '../features/notifications/NotificationCenter';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const navigate = useNavigate();
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

  const { data: jobs } = useQuery({ 
    queryKey: ['nearbyJobs', profile?.location, coords], 
    queryFn: () => searchJobs('', '', profile?.location || '', coords?.lat, coords?.lon, 50),
    staleTime: 60000 
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 pb-20">
      <header className="p-6 flex justify-between items-center border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="text-xl font-black italic tracking-tighter uppercase">TrustPro</div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
        <ProfileCard />
        <ActionGrid />
        
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold">Jobs Near You</h3>
            <button 
              onClick={() => navigate('/search')}
              className="text-xs text-indigo-400 font-bold uppercase cursor-pointer"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {jobs?.slice(0, 3).map(job => (
              <div key={job.jobId} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{job.title}</h4>
                    <p className="text-xs text-slate-500 italic">{job.location} • {job.industry}</p>
                  </div>
                  <span className="text-emerald-400 font-black text-lg">₹{job.budget?.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => navigate(`/job/${job.jobId}`)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold active:scale-95 transition-all text-sm cursor-pointer shadow-lg hover:bg-indigo-700"
                >
                  Quick Apply
                </button>
              </div>
            ))}
            {(!jobs || jobs.length === 0) && (
              <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center">
                <p className="text-slate-500 italic">No jobs found nearby.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
