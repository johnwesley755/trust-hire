import { ActionTiles } from '../features/dashboard/DashboardComponents';
import { useQuery } from '@tanstack/react-query';
import { searchJobs } from '../api/search.service';
import { profileService } from '../api/profile.service';
import { jobService } from '../api/job.service';
import { applicationService } from '../api/application.service';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { motion } from 'framer-motion';
import { MapPin, Search, ShieldCheck, Briefcase, User as UserIcon, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const navigate = useNavigate();
  useLanguage();
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const searchLocation = profile?.city || profile?.address || profile?.location || '';

  const { data: jobs } = useQuery({ 
    queryKey: ['nearbyJobs', searchLocation, coords], 
    queryFn: () => searchJobs('', '', searchLocation, coords?.lat, coords?.lon, 50),
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

  const visibleJobs = (jobs && jobs.length > 0)
    ? jobs.map((job) => ({
        id: job.jobId,
        title: job.title,
        location: job.location,
        budget: job.budget,
        industry: job.industry,
      }))
    : allJobs
        .filter((job) => job.status === 'OPEN')
        .slice(0, 4)
        .map((job) => ({
          id: job.id || '',
          title: job.title,
          location: job.city || job.address || job.location,
          budget: job.budget,
          industry: job.industry,
        }));

  const visibleJobIds = visibleJobs.map(j => j.id);

  const { data: applicationCounts = {} } = useQuery({
    queryKey: ['applicationCounts', visibleJobIds],
    queryFn: () => jobService.getApplicationCounts(visibleJobIds),
    enabled: visibleJobIds.length > 0,
    staleTime: 30000,
  });

  const { data: jobStats } = useQuery({
    queryKey: ['jobStats'],
    queryFn: jobService.getStats,
    staleTime: 300000,
  });

  const { data: workerStats } = useQuery({
    queryKey: ['workerStats'],
    queryFn: profileService.getGlobalStats,
    staleTime: 300000,
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <>
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />

        <main className="p-4 md:p-8 max-w-[1400px] mx-auto w-full relative z-10 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar: Trending Hub */}
            <div className="lg:col-span-3 space-y-6 sticky top-24 hidden lg:block">
               <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-sm overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full -mr-8 -mt-8" />
                   <h4 className="text-[10px] font-black tracking-widest text-brand-muted uppercase opacity-40 mb-6 flex items-center gap-2">
                       <Globe className="w-3 h-3 text-brand-primary" /> Global Activity
                   </h4>
                   <div className="space-y-4">
                       <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/50 transition-all hover:bg-white hover:shadow-sm">
                           <p className="text-[10px] font-bold text-brand-secondary/60 uppercase tracking-widest mb-1">New Jobs Today</p>
                           <p className="text-2xl font-black text-brand-secondary">
                               {jobStats?.jobsToday ?? '...'}
                           </p>
                       </div>
                       <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/50 transition-all hover:bg-white hover:shadow-sm">
                           <p className="text-[10px] font-bold text-brand-secondary/60 uppercase tracking-widest mb-1">Verified Workers</p>
                           <p className="text-2xl font-black text-brand-secondary">
                               {workerStats?.totalWorkers ? `${(workerStats.totalWorkers / 1000).toFixed(1)}k+` : '...'}
                           </p>
                       </div>
                   </div>
               </div>
               <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-sm">
                   <h4 className="text-[10px] font-black tracking-widest text-brand-muted uppercase opacity-40 mb-4">Your Recent Activity</h4>
                   <div className="space-y-3">
                       <div className="flex items-center justify-between text-xs transition-transform hover:translate-x-1 cursor-default">
                           <span className="text-brand-muted font-semibold">Profile views</span>
                           <span className="text-brand-primary font-bold">{profile?.profileViews ?? 0}</span>
                       </div>
                       <div className="flex items-center justify-between text-xs transition-transform hover:translate-x-1 cursor-default">
                           <span className="text-brand-muted font-semibold">Applied jobs</span>
                           <span className="text-brand-primary font-bold">{myApplications.length}</span>
                       </div>
                   </div>
               </div>
            </div>
            
            {/* Center: Main Feed */}
            <div className="lg:col-span-6 space-y-6">
                {/* Search / Feed Header - NOW SEO OPTIMIZED */}
                <form 
                    onSubmit={handleSearch}
                    className="bg-white p-4 md:p-6 rounded-3xl border border-brand-border flex items-center gap-4 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all"
                >
                    <label htmlFor="job-search" className="sr-only">Search for work</label>
                    <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center shrink-0">
                        <Search className="w-6 h-6 text-brand-secondary/40" />
                    </div>
                    <input 
                        id="job-search"
                        type="text"
                        placeholder="What kind of work are you looking for?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search for jobs by title, skills or industry"
                        className="flex-1 bg-brand-bg h-12 rounded-xl px-4 flex items-center text-brand-secondary text-sm font-semibold border border-brand-border/50 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                    <button 
                        type="submit"
                        className="bg-brand-secondary text-brand-primary px-4 md:px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm active:scale-95"
                    >
                        Explore
                    </button>
                </form>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-brand-secondary tracking-tight">Recommended for you</h3>
                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest opacity-40">Showing {visibleJobs.length} opportunities</p>
                    </div>

                    {visibleJobs.map((job, i) => (
                    <motion.div 
                        key={job.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-3xl border border-brand-border hover:border-brand-primary p-6 space-y-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 min-w-0">
                                <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center shrink-0 border border-brand-border group-hover:bg-brand-primary/10 transition-colors">
                                    <Briefcase className="w-6 h-6 text-brand-secondary" />
                                </div>
                                <div className="space-y-1 min-w-0">
                                    <h4 className="font-bold text-lg text-brand-secondary leading-tight truncate group-hover:text-brand-primary transition-colors">{job.title}</h4>
                                    <div className="flex items-center gap-2 text-brand-muted/60 font-semibold text-xs">
                                        <MapPin className="w-3 h-3" /> {job.location} • {job.industry}
                                    </div>
                                    <div className="pt-1">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                            <ShieldCheck className="w-3 h-3" /> Verified Employer
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-xl font-black text-brand-secondary tracking-tight">₹{job.budget?.toLocaleString()}</div>
                                <div className="text-[9px] font-bold text-brand-muted uppercase tracking-widest opacity-40">per project</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(n => (
                                    <div key={n} className="w-8 h-8 rounded-lg bg-brand-bg border-2 border-white flex items-center justify-center overflow-hidden">
                                        <UserIcon className="w-4 h-4 text-brand-secondary opacity-20" />
                                    </div>
                                ))}
                                <div className="pl-4 self-center text-[10px] font-bold text-brand-muted/60 tracking-tight">
                                    {applicationCounts[job.id] ?? 0} candidates applied
                                </div>
                            </div>
                            <button 
                                onClick={() => !appliedJobIds.has(job.id) && navigate(`/job/${job.id}`)}
                                disabled={appliedJobIds.has(job.id)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all text-[10px] tracking-widest uppercase ${
                                    appliedJobIds.has(job.id)
                                    ? 'bg-emerald-500 text-white cursor-default'
                                    : 'bg-brand-secondary text-brand-primary hover:bg-neutral-800'
                                }`}
                            >
                                {appliedJobIds.has(job.id) ? 'Applied' : 'Details'}
                            </button>
                        </div>
                    </motion.div>
                    ))}
                    
                    {visibleJobs.length === 0 && (
                    <div className="p-20 rounded-3xl bg-white border border-dashed border-brand-border text-center space-y-4">
                        <Search className="w-12 h-12 text-brand-secondary/10 mx-auto" />
                        <p className="text-brand-muted font-bold text-sm">No jobs found in your area yet.</p>
                    </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar: Suggestions */}
            <div className="lg:col-span-3 space-y-6 sticky top-24 hidden lg:block">
               <ActionTiles />
               <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-sm">
                   <h4 className="text-[10px] font-black tracking-widest text-brand-muted uppercase opacity-40 mb-4">Trending Skills</h4>
                   <div className="flex flex-wrap gap-2">
                       {['Plumbing', 'Electrical', 'Housekeeping', 'Security', 'Carpentry'].map(skill => (
                           <button key={skill} className="px-3 py-1.5 bg-brand-bg hover:bg-brand-primary/10 text-[10px] font-bold text-brand-muted rounded-lg transition-colors">
                               #{skill}
                           </button>
                       ))}
                   </div>
               </div>
            </div>
          </div>
        </main>
    </>
  );
}
