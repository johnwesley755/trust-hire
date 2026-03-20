import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchJobs, type JobSearch } from '../api/search.service';
import { jobService, type Job } from '../api/job.service';
import { applicationService } from '../api/application.service';
import { profileService, type WorkerProfile } from '../../profile/api/profile.service';
import { Search, MapPin, Briefcase, CheckCircle, Globe, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMissingProfileFields, getMissingProfileFields } from '../../../core/utils/profileCompletion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../../core/hooks/useLanguage';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('city') || '';
    setQuery(q);
    setCity(c);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSearchParams = (newQuery: string, newCity: string) => {
    const params: Record<string, string> = {};
    if (newQuery) params.q = newQuery;
    if (newCity) params.city = newCity;
    setSearchParams(params);
  };


  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['jobSearch', query, city],
    queryFn: () => searchJobs(
        query, 
        '', 
        '', 
        city,
        undefined, 
        undefined, 
        undefined
    ),
    enabled: Boolean(query || city),
  });

  const { data: allJobs, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allJobs'],
    queryFn: () => jobService.getAllJobs(),
    enabled: !query && !city,
  });

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: myApplications = [], refetch: refetchApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const jobs = (query || city) ? searchResults : allJobs;
  const isLoading = isSearching || isLoadingAll;
  const appliedJobIds = new Set(myApplications.map((application) => application.jobId));

  return (
    <>
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <header className="px-6 py-8 md:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
            <div className="max-w-5xl mx-auto space-y-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                            <Globe className="w-3.5 h-3.5 text-brand-primary" /> Market Intelligence
                        </div>
                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter text-brand-secondary leading-[0.9]">Opportunity hub</h1>
                    </div>

                    <div className="bg-white border border-brand-border rounded-3xl md:rounded-[2.5rem] shadow-2xl p-4 md:p-2 flex flex-col md:flex-row items-stretch gap-2 group transition-all focus-within:ring-4 focus-within:ring-brand-primary/10">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search roles or expertise..." 
                                className="w-full bg-transparent py-4 md:py-6 pl-16 pr-6 focus:outline-none font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    updateSearchParams(e.target.value, city);
                                }}
                            />
                        </div>
                        <div className="hidden md:block w-px bg-brand-border my-4" />
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Mumbai, Delhi..." 
                                className="w-full bg-transparent py-4 md:py-6 pl-16 pr-6 focus:outline-none font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
                                value={city}
                                onChange={(e) => {
                                    setCity(e.target.value);
                                    updateSearchParams(query, e.target.value);
                                }}
                            />
                        </div>
                        <button className="bg-brand-secondary text-brand-primary py-4 md:py-0 px-10 rounded-2xl md:rounded-3xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group/btn">
                            Search <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
            </div>
        </header>

        <main className="max-w-5xl mx-auto p-8 lg:p-12 w-full space-y-10 relative z-10">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-brand-primary border-t-brand-secondary rounded-full animate-spin" />
                    <p className="text-brand-muted font-semibold tracking-widest text-[9px] md:text-[10px] animate-pulse">Syncing Opportunities...</p>
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
        className="bg-white border border-brand-border p-6 md:p-10 rounded-3xl md:rounded-[3rem] hover:border-brand-primary transition-all group shadow-sm hover:shadow-2xl relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-[0.02] rounded-bl-full group-hover:opacity-[0.08] transition-opacity" />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-secondary p-4 rounded-2xl text-brand-primary shadow-lg transform group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                         <h3 className="text-xl md:text-3xl font-bold text-brand-secondary tracking-tighter leading-none group-hover:text-brand-primary transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-brand-muted/60 font-medium text-xs tracking-widest">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.city || job.location}</span>
                            <span className="w-1 h-1 bg-brand-border rounded-full" />
                            <span>{job.industry}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-left md:text-right bg-brand-bg md:bg-transparent px-6 py-4 md:p-0 rounded-2xl border border-brand-border md:border-0 w-full md:w-auto">
                <div className="flex items-center md:justify-end gap-2 text-brand-secondary font-semibold text-2xl md:text-3xl tracking-tighter">
                    <span className="text-brand-primary text-lg md:text-xl">₹</span>
                    {job.budget?.toLocaleString()}
                </div>
                <p className="text-[9px] text-brand-muted font-semibold tracking-widest mt-1 ml-1 md:ml-0">Financial Allocation</p>
            </div>
        </div>

        <div className="bg-brand-bg/50 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-10 border border-brand-border/50 text-left">
            <p className="text-brand-muted/80 font-medium leading-relaxed line-clamp-2 h-10 md:h-12 text-base md:text-lg">
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
