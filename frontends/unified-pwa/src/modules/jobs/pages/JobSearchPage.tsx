import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchJobs } from '../../../services/search.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JobSearchHero } from '../components/JobSearchHero';
import { JobSearchResultCard } from '../components/JobSearchResultCard';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');

  const updateSearchParams = (newQuery: string, newCity: string) => {
    const params: Record<string, string> = {};
    if (newQuery) params.q = newQuery;
    if (newCity) params.city = newCity;
    setSearchParams(params);
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['jobSearch', query, city],
    queryFn: () => searchJobs(query, '', '', city),
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

  const applyMutation = useMutation({
    mutationFn: (data: { jobId: string; coverLetter: string }) => applicationService.applyForJob(data),
    onSuccess: async () => {
      await refetchApplications();
    },
    onError: async (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError?.response?.data?.message || axiosError?.message || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        await refetchApplications();
        return;
      }
      alert(message);
    }
  });

  const handleApply = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const jobs = (query || city) ? searchResults : allJobs;
  const isLoading = isSearching || isLoadingAll;
  const appliedJobIds = new Set(myApplications.map((app) => app.jobId));

  return (
    <div className="relative min-h-screen">
      <JobSearchHero 
        query={query}
        city={city}
        onQueryChange={(val) => {
          setQuery(val);
          updateSearchParams(val, city);
        }}
        onCityChange={(val) => {
          setCity(val);
          updateSearchParams(query, val);
        }}
        onSearch={() => updateSearchParams(query, city)}
      />

      <main className="p-8 lg:p-12 pr-8 lg:pr-16 w-full space-y-10 relative z-10 -mt-10">
        <div className="flex justify-between items-end px-4 mb-4">
          <h2 className="text-2xl font-black text-[#1F3F34] tracking-tighter leading-none">
            {query || city ? 'Matched Opportunities' : 'Available Roles'}
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30 bg-white px-3 py-1 rounded-full shadow-sm">
            {jobs?.length || 0} Critical Openings
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-[#1F3F34]/5">
            <Loader2 className="w-12 h-12 text-[#FACD15] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20 animate-pulse">Syncing Opportunity Feed...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <AnimatePresence mode="popLayout">
              {jobs?.map((job: any, i: number) => {
                const id = 'jobId' in job ? job.jobId : job.id;
                return (
                  <JobSearchResultCard
                    key={id}
                    job={job}
                    index={i}
                    applied={Boolean(id && appliedJobIds.has(id))}
                    isApplying={applyMutation.isPending && (applyMutation.variables as any)?.jobId === id}
                    onApply={() => id && handleApply(id)}
                  />
                );
              })}
            </AnimatePresence>
            
            {jobs?.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-32 bg-white border border-dashed border-[#1F3F34]/10 rounded-[3.5rem] space-y-4 shadow-inner"
              >
                <div className="w-20 h-20 bg-[#F5F4EF] rounded-full flex items-center justify-center mx-auto grayscale group hover:grayscale-0 transition-all border border-[#1F3F34]/5">
                  <Search className="w-8 h-8 text-[#FACD15]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[#1F3F34] font-black text-xl tracking-tight">Feed Empty</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30">Try adjusting your search parameters.</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Load More CTA */}
        {!isLoading && jobs && jobs.length > 0 && (
          <div className="text-center pt-8 mb-16 lg:mb-0">
            <button className="px-12 py-5 bg-[#EFEEE9] text-[#1F3F34] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#E9E8E3] transition-all active:scale-95 shadow-sm border border-[#1F3F34]/5">
              Discover More Opportunities
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
