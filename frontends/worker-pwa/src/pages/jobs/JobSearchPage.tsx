import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchJobs, fetchMyApplications } from '../../store/slices/jobSlice';
import { fetchProfile } from '../../store/slices/profileSlice';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JobSearchHero } from '../../components/jobs/JobSearchHero';
import { JobSearchResultCard } from '../../components/jobs/JobSearchResultCard';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');

  const { jobs, loading: jobsLoading, appliedJobs } = useAppSelector((state) => state.jobs);
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMyApplications());
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchJobs({ query, location: city }));
  }, [dispatch, query, city]);

  const updateSearchParams = (newQuery: string, newCity: string) => {
    const params: Record<string, string> = {};
    if (newQuery) params.q = newQuery;
    if (newCity) params.city = newCity;
    setSearchParams(params);
  };

  const handleApply = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const appliedJobIds = new Set(appliedJobs?.map((app: any) => app.jobId) || []);

  return (
    <div className="relative min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
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
        onSearch={() => dispatch(searchJobs({ query, location: city }))}
      />

      <main className="p-8 lg:p-12 pr-8 lg:pr-16 w-full space-y-10 relative z-10 -mt-10">
        <div className="flex justify-between items-end px-4 mb-4">
          <h2 className="text-2xl font-black text-[#1F3F34] tracking-tighter leading-none bricolage">
            {query || city ? 'Matched Opportunities' : 'Available Roles'}
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30 bg-white px-3 py-1 rounded-full shadow-sm">
            {jobs?.length || 0} Critical Openings
          </span>
        </div>

        {jobsLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-[#1F3F34]/5">
            <Loader2 className="w-12 h-12 text-[#FACD15] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20 animate-pulse italic">Syncing Opportunity Feed...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <AnimatePresence mode="popLayout">
              {jobs?.map((job: any, i: number) => {
                const id = job.jobId || job.id;
                return (
                  <JobSearchResultCard
                    key={id}
                    job={job}
                    index={i}
                    applied={Boolean(id && appliedJobIds.has(id))}
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
                  <p className="text-[#1F3F34] font-black text-xl tracking-tight bricolage">Feed Empty</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30">Try adjusting your search parameters.</p>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Load More CTA */}
        {!jobsLoading && jobs && jobs.length > 0 && (
          <div className="text-center pt-8 mb-16 lg:mb-0">
            <button className="px-12 py-5 bg-[#EFEEE9] text-[#1F3F34] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-[#FACD15] transition-all active:scale-95 shadow-sm border border-[#1F3F34]/5">
              Discover More Opportunities
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
