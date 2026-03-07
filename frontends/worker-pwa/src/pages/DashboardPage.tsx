import { UserButton } from "@clerk/clerk-react";
import { ProfileCard, ActionGrid, BottomNav } from '../features/dashboard/DashboardComponents';
import { DashboardSidebar } from '../features/dashboard/DashboardSidebar';
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="p-6 flex justify-between items-center border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-xl z-50 md:hidden">
          <div className="text-xl font-black italic tracking-tighter uppercase text-primary-600">TrustPro</div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-in slide-in-from-bottom duration-500 pb-24 md:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-12">
               <h1 className="text-3xl font-black tracking-tight mb-2 hidden md:block">Worker Dashboard</h1>
               <p className="text-slate-500 hidden md:block mb-8 font-medium italic">Welcome back! Here are the latest opportunities for you.</p>
            </div>
            
            <div className="lg:col-span-4 space-y-8">
               <ProfileCard />
               <ActionGrid />
            </div>

            <section className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-black tracking-tight">Jobs Near You</h3>
                <button 
                  onClick={() => navigate('/search')}
                  className="text-[10px] text-primary-600 font-black uppercase tracking-widest cursor-pointer hover:underline"
                >
                  View All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs?.slice(0, 4).map(job => (
                  <div key={job.jobId} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm hover:border-primary-400 transition-all group">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h4>
                        <p className="text-xs text-slate-500 italic">{job.location} • {job.industry}</p>
                      </div>
                      <span className="text-emerald-500 font-black text-lg">₹{job.budget?.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/job/${job.jobId}`)}
                      className="w-full py-3 bg-primary-600 text-white rounded-2xl font-bold active:scale-95 transition-all text-sm cursor-pointer shadow-lg shadow-primary-600/20 hover:bg-primary-700"
                    >
                      Quick Apply
                    </button>
                  </div>
                ))}
                {(!jobs || jobs.length === 0) && (
                  <div className="col-span-full p-12 rounded-4xl bg-white border border-dashed border-slate-200 text-center">
                    <p className="text-slate-500 italic">No jobs found nearby.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
