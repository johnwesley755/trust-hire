import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchJobs } from '../../../services/search.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
import { Search, Loader2, Sparkles, SlidersHorizontal, MapPin, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JobSearchHero } from '../components/JobSearchHero';
import { JobSearchResultCard } from '../components/JobSearchResultCard';

const TRADE_CATEGORIES = [
  "All",
  "Electrician",
  "Plumbing",
  "Warehouse",
  "Driver",
  "Welder",
  "Carpenter",
  "Mason",
  "Facility"
];

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');

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

  const { data: allJobs = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['allJobs'],
    queryFn: () => jobService.getAllJobs(),
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

  const appliedJobIds = new Set(myApplications.map((app) => app.jobId));
  const baseJobsList = (query || city) ? (searchResults || []) : allJobs;

  // Compute recommended vs all filtered jobs
  const displayJobs = useMemo(() => {
    let list = [...baseJobsList];

    // Filter by trade category pill if selected
    if (selectedTrade !== 'All') {
      const term = selectedTrade.toLowerCase();
      list = list.filter(j => 
        j.title?.toLowerCase().includes(term) ||
        (j as any).skills?.toLowerCase().includes(term) ||
        j.industry?.toLowerCase().includes(term) ||
        j.description?.toLowerCase().includes(term)
      );
    }

    // If Recommended tab is active, prioritize candidate's skills and city
    if (activeTab === 'recommended' && profile) {
      const candidateSkills = (profile.skills || '').toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
      const candidateCity = (profile.city || profile.location || '').toLowerCase();

      if (candidateSkills.length > 0 || candidateCity) {
        const matchingJobs = list.filter(j => {
          const matchSkill = candidateSkills.some((s: string) => 
            j.title?.toLowerCase().includes(s) || 
            (j as any).skills?.toLowerCase().includes(s) ||
            j.industry?.toLowerCase().includes(s)
          );
          const matchCity = candidateCity && (j.city?.toLowerCase().includes(candidateCity) || j.location?.toLowerCase().includes(candidateCity));
          return matchSkill || matchCity;
        });

        if (matchingJobs.length > 0) {
          return matchingJobs;
        }
      }
    }

    return list;
  }, [baseJobsList, selectedTrade, activeTab, profile]);

  const isLoading = isSearching || isLoadingAll;

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#0F172A]">
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

      <main className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4 relative z-10 -mt-5">
        {/* Controls Strip: Tabs & Filters */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Recommendation Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              <button
                onClick={() => setActiveTab('recommended')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'recommended'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0066FF]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Recommended For You
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0066FF]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                All Openings ({baseJobsList.length})
              </button>
            </div>

            <div className="text-xs font-extrabold text-[#0066FF] uppercase tracking-wider">
              {displayJobs.length} Live Openings Found
            </div>
          </div>

          {/* Trade Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#0066FF]" /> Trades:
            </span>
            {TRADE_CATEGORIES.map((trade) => (
              <button
                key={trade}
                onClick={() => setSelectedTrade(trade)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedTrade === trade
                    ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm font-extrabold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-[#0066FF]'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Scanning Hyper-Local Openings...</p>
          </div>
        ) : displayJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Openings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your trade filters or area to discover more instant shift opportunities.
            </p>
            <button
              onClick={() => {
                setSelectedTrade('All');
                setQuery('');
                setCity('');
                setActiveTab('all');
                setSearchParams({});
              }}
              className="bg-[#0066FF] text-white text-xs font-bold px-5 py-2 rounded-xl uppercase tracking-wider shadow-sm hover:bg-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {displayJobs.map((job, index) => (
                <JobSearchResultCard 
                  key={job.id} 
                  job={job} 
                  index={index} 
                  applied={appliedJobIds.has(job.id)}
                  onApply={() => handleApply(job.id)}
                  isApplying={applyMutation.isPending && applyMutation.variables?.jobId === job.id}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

      </main>
    </div>
  );
}
