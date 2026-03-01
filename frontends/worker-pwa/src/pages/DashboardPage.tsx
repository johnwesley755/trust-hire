import { UserButton } from "@clerk/clerk-react";
import { ProfileCard, ActionGrid, BottomNav } from '../features/dashboard/DashboardComponents';
import { useQuery } from '@tanstack/react-query';
import { searchJobs } from '../api/search.service';
import { useNavigate } from 'react-router-dom';

import { NotificationCenter } from '../features/notifications/NotificationCenter';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobs } = useQuery({ 
    queryKey: ['nearbyJobs'], 
    queryFn: () => searchJobs('', '', ''),
    staleTime: 60000 
  });

  return (
    <div className="min-h-screen w-full bg-[#070b14] text-white pb-20">
      <header className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#070b14]/80 backdrop-blur-xl z-50">
        <div className="text-xl font-black italic tracking-tighter uppercase">TrustPro</div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
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
              <div key={job.jobId} className="p-6 rounded-3xl bg-white/3 border border-white/6 space-y-4 shadow-xl shadow-black/40">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{job.title}</h4>
                    <p className="text-xs text-slate-500 italic">{job.location} • {job.industry}</p>
                  </div>
                  <span className="text-emerald-400 font-black text-lg">₹{job.budget?.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => navigate(`/job/${job.jobId}`)}
                  className="w-full py-3 bg-white text-black rounded-2xl font-bold active:scale-95 transition-all text-sm cursor-pointer shadow-lg hover:bg-indigo-50"
                >
                  Quick Apply
                </button>
              </div>
            ))}
            {(!jobs || jobs.length === 0) && (
              <div className="p-8 rounded-3xl bg-white/2 border border-dashed border-white/5 text-center">
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
