import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchJobs, type JobSearch } from '../api/search.service';
import { jobService, type Job } from '../api/job.service';
import { applicationService } from '../api/application.service';
import { profileService, type WorkerProfile } from '../api/profile.service';
import { Search, MapPin, Briefcase, CheckCircle, Navigation, Globe, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMissingProfileFields, getMissingProfileFields } from '../utils/profileCompletion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
  const [radius, setRadius] = useState(50);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLocation("Detected Location");
          setIsDetecting(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setIsDetecting(false);
          alert("Could not detect location. Please type it manually.");
        }
      );
    } else {
        setIsDetecting(false);
        alert("Geolocation is not supported by this browser.");
    }
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['jobSearch', query, location, coords, radius],
    queryFn: () => searchJobs(
        query, 
        '', 
        coords ? '' : location, 
        coords?.lat, 
        coords?.lon, 
        radius
    ),
    enabled: Boolean(query || coords || (location && location !== "Detected Location")),
  });

  const { data: allJobs, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allJobs'],
    queryFn: () => jobService.getAllJobs(),
    enabled: !query && !coords && (!location || location === "Detected Location"),
  });

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: myApplications = [], refetch: refetchApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const jobs = (query || coords || (location && location !== "Detected Location")) ? searchResults : allJobs;
  const isLoading = isSearching || isLoadingAll;
  const appliedJobIds = new Set(myApplications.map((application) => application.jobId));

  return (
    <>
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <header className="p-8 lg:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                            <Globe className="w-3.5 h-3.5 text-brand-primary" /> Market Intelligence
                        </div>
                        <h1 className="text-5xl font-semibold tracking-tighter text-brand-secondary leading-[0.9]">Opportunity hub</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-brand-border px-6 py-3 rounded-2xl shadow-sm">
                         <Navigation className={`w-4 h-4 text-brand-primary ${isDetecting ? 'animate-pulse' : ''}`} />
                         <div className="flex flex-col">
                            <span className="text-[9px] font-semibold text-brand-muted tracking-widest">Global Range</span>
                            <span className="text-[11px] font-semibold text-brand-secondary">{radius} KM Radius</span>
                         </div>
                         <input 
                            type="range" 
                            min="5" 
                            max="200" 
                            step="5"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                            className="ml-4 h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-secondary w-24 md:w-40"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Search roles or expertise..." 
                            className="w-full bg-white border border-brand-border rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-brand-primary transition-all shadow-sm font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-1 relative group">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Location Filter" 
                            className="w-full bg-white border border-brand-border rounded-3xl py-6 pl-16 pr-6 focus:outline-none focus:border-brand-primary transition-all shadow-sm font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
                                setCoords(null);
                            }}
                        />
                    </div>
                    <button 
                        onClick={detectLocation}
                        disabled={isDetecting}
                        className="bg-brand-secondary text-brand-primary hover:bg-neutral-800 p-6 rounded-3xl transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 font-semibold text-[10px] tracking-widest"
                    >
                        <Navigation className={`w-5 h-5 ${isDetecting ? 'animate-pulse' : ''}`} />
                        <span className="hidden lg:inline">Sync GPS</span>
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-5xl mx-auto p-8 lg:p-12 w-full space-y-10 relative z-10">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-brand-secondary rounded-full animate-spin" />
                    <p className="text-brand-muted font-semibold tracking-widest text-[10px] animate-pulse">Syncing Opportunities...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 mb-12">
                    <AnimatePresence mode="popLayout">
                        {jobs?.map((job, i) => (
                            <JobCard
                              key={'jobId' in job ? job.jobId : job.id}
                              job={job}
                              index={i}
                              profile={profile}
                              applied={Boolean(('jobId' in job ? job.jobId : job.id) && appliedJobIds.has(('jobId' in job ? job.jobId : job.id)!))}
                              onApplicationSaved={refetchApplications}
                              onRequireProfileCompletion={() => navigate('/profile')}
                            />
                        ))}
                    </AnimatePresence>
                    
                    {jobs?.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 bg-white border border-dashed border-brand-border rounded-[3rem] space-y-4 shadow-inner"
                        >
                            <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto opacity-40 grayscale">
                                <Search className="w-10 h-10 text-brand-secondary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-brand-secondary font-bold text-xl tracking-tight">Access denied</p>
                                <p className="text-brand-muted font-medium">No matches found within the specified parameters.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </main>
      </>
    );
}

function JobCard({
  job,
  index,
  profile,
  applied,
  onApplicationSaved,
  onRequireProfileCompletion,
}: {
  job: JobSearch | Job;
  index: number;
  profile?: WorkerProfile;
  applied: boolean;
  onApplicationSaved: () => Promise<unknown>;
  onRequireProfileCompletion: () => void;
}) {
  const jobId = 'jobId' in job ? job.jobId : job.id;
  const { t } = useLanguage();
  
  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof applicationService.applyForJob>[0]) => applicationService.applyForJob(data),
    onSuccess: async () => {
      await onApplicationSaved();
    },
    onError: async (error: Error | any) => {
      const message = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        await onApplicationSaved();
        return;
      }
      alert(message);
    }
  });

  const handleApply = () => {
    const missingFields = getMissingProfileFields(profile);
    if (missingFields.length > 0) {
      alert(`Complete your profile before applying. Missing: ${formatMissingProfileFields(missingFields)}.`);
      onRequireProfileCompletion();
      return;
    }
    if (jobId) {
        mutation.mutate({ jobId: jobId, coverLetter: "Professional application for the specified position." });
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white border border-brand-border p-10 rounded-[3rem] hover:border-brand-primary transition-all group shadow-sm hover:shadow-2xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-[0.02] rounded-bl-full group-hover:opacity-[0.08] transition-opacity" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-secondary p-4 rounded-2xl text-brand-primary shadow-lg transform group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                         <h3 className="text-3xl font-bold text-brand-secondary tracking-tighter leading-none group-hover:text-brand-primary transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-brand-muted/60 font-medium text-xs tracking-widest">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                            <span className="w-1 h-1 bg-brand-border rounded-full" />
                            <span>{job.industry}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-left md:text-right bg-brand-bg md:bg-transparent px-6 py-4 md:p-0 rounded-2xl border border-brand-border md:border-0 w-full md:w-auto">
                <div className="flex items-center md:justify-end gap-2 text-brand-secondary font-semibold text-3xl tracking-tighter">
                    <span className="text-brand-primary text-xl">₹</span>
                    {job.budget?.toLocaleString()}
                </div>
                <p className="text-[9px] text-brand-muted font-semibold tracking-widest mt-1 ml-1 md:ml-0">Financial Allocation</p>
            </div>
        </div>

        <div className="bg-brand-bg/50 rounded-3xl p-8 mb-10 border border-brand-border/50 text-left">
            <p className="text-brand-muted/80 font-medium leading-relaxed line-clamp-2 h-12 text-lg">
                {job.description}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-white border border-brand-border rounded-xl text-[9px] font-semibold tracking-widest text-brand-muted flex items-center gap-2 group-hover:border-brand-primary/30 transition-colors">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Immediate Deployment
                </div>
                <div className="px-4 py-2 bg-white border border-brand-border rounded-xl text-[9px] font-semibold tracking-widest text-brand-muted flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Verified Enterprise
                </div>
            </div>
            
            <button 
                onClick={handleApply}
                disabled={applied || mutation.isPending}
                className={`w-full sm:w-auto px-12 py-5 rounded-4xl font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-4 tracking-widest shadow-2xl ${
                    applied 
                    ? 'bg-emerald-500 text-white cursor-default' 
                    : 'bg-brand-secondary text-brand-primary hover:bg-neutral-800 cursor-pointer shadow-brand-secondary/20'
                }`}
            >
                {applied ? (
                    <><CheckCircle className="w-5 h-5" /> {t('dashboard.applied')}</>
                ) : mutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>Initiate Application <ChevronRight className="w-5 h-5" /></>
                )}
            </button>
        </div>
    </motion.div>
  );
}
