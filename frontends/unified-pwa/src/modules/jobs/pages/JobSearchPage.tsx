import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchService } from '../../../services/search.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
import { queryKeys } from '../../../lib/queryKeys';
import { 
  Briefcase, 
  UploadCloud, 
  ArrowUpDown, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { JobSearchHero } from '../components/JobSearchHero';
import { JobFilterSidebar, type FilterCounts } from '../components/JobFilterSidebar';
import { JobSearchResultCard, type JobCardData } from '../components/JobSearchResultCard';
import { JobSearchRightSidebar } from '../components/JobSearchRightSidebar';
import { AppLoader } from '../../../components/common/AppLoader';
import { detectCurrentCity } from '../../../utils/geolocation';

export default function JobSearchPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [jobType, setJobType] = useState(searchParams.get('type') || 'All');
  const [budgetRange, setBudgetRange] = useState(searchParams.get('budget') || 'all');
  const [experience, setExperience] = useState(searchParams.get('exp') || 'all');
  const [trade, setTrade] = useState(searchParams.get('trade') || 'All');
  const [sortBy, setSortBy] = useState<'date_desc' | 'salary_desc' | 'salary_asc'>('date_desc');
  const [isLocating, setIsLocating] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL changes externally
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('city') || '';
    const t = searchParams.get('type') || 'All';
    const b = searchParams.get('budget') || 'all';
    const exp = searchParams.get('exp') || 'all';
    const tr = searchParams.get('trade') || 'All';

    if (q !== query) setQuery(q);
    if (c !== city) setCity(c);
    if (t !== jobType) setJobType(t);
    if (b !== budgetRange) setBudgetRange(b);
    if (exp !== experience) setExperience(exp);
    if (tr !== trade) setTrade(tr);
  }, [searchParams]);

  // Helper to sync to URL
  const updateUrlParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val && val !== 'All' && val !== 'all') {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Convert budget range to min/max
  const { minSalary, maxSalary } = useMemo(() => {
    switch (budgetRange) {
      case 'under1000': return { minSalary: 0, maxSalary: 1000 };
      case '1000to2500': return { minSalary: 1000, maxSalary: 2500 };
      case '2500to5000': return { minSalary: 2500, maxSalary: 5000 };
      case 'above5000': return { minSalary: 5000, maxSalary: 9999999 };
      default: return { minSalary: undefined, maxSalary: undefined };
    }
  }, [budgetRange]);

  // Convert experience to min/max
  const { minExperience, maxExperience } = useMemo(() => {
    switch (experience) {
      case '0-1': return { minExperience: 0, maxExperience: 1 };
      case '1-3': return { minExperience: 1, maxExperience: 3 };
      case '3-5': return { minExperience: 3, maxExperience: 5 };
      case '5+': return { minExperience: 5, maxExperience: 50 };
      default: return { minExperience: undefined, maxExperience: undefined };
    }
  }, [experience]);

  // Fetch Jobs via Search API
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs', 'search', { query, city, trade, jobType, minSalary, maxSalary, minExperience, maxExperience, sortBy }],
    queryFn: () => searchService.searchJobs({
      query: query || undefined,
      city: city || undefined,
      industry: trade !== 'All' ? trade : undefined,
      minSalary,
      maxSalary,
      minExperience,
      maxExperience,
      sortBy
    }),
    staleTime: 1000 * 60 * 2,
  });

  // Fetch user profile and applications to compute status badges
  const { data: profile } = useQuery({
    queryKey: queryKeys.workers.detail('me'),
    queryFn: profileService.getProfile,
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: queryKeys.jobs.myApplications,
    queryFn: applicationService.getMyApplications,
  });

  const appliedJobIdsMap = useMemo(() => {
    const map = new Map<string, string>();
    myApplications.forEach((app: any) => {
      const jId = app.job_id || app.jobId;
      if (jId) map.set(jId, app.status || 'APPLIED');
    });
    return map;
  }, [myApplications]);

  // Apply to Job Mutation
  const applyMutation = useMutation({
    mutationFn: (jobId: string) => applicationService.applyForJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.myApplications });
      queryClient.invalidateQueries({ queryKey: ['jobs', 'search'] });
    }
  });

  // Compute dynamic filter counts from fetched jobs
  const filterCounts: FilterCounts = useMemo(() => {
    const counts: FilterCounts = {
      jobTypes: {},
      locations: {},
      trades: {},
      total: jobs.length,
    };

    jobs.forEach((j: any) => {
      // Job Type
      const type = j.jobType || (j.title?.toLowerCase().includes('intern') ? 'Internship' : 'Full Time');
      counts.jobTypes[type] = (counts.jobTypes[type] || 0) + 1;

      // Location / City
      const c = j.city || j.location;
      if (c) counts.locations[c] = (counts.locations[c] || 0) + 1;

      // Trade / Industry
      if (j.industry) counts.trades[j.industry] = (counts.trades[j.industry] || 0) + 1;
    });

    return counts;
  }, [jobs]);

  // Handle Search Submission
  const handleSearch = (newQuery: string, newCity: string) => {
    setQuery(newQuery);
    setCity(newCity);
    updateUrlParams({ q: newQuery, city: newCity });
  };

  // Handle Auto Location
  const handleLocateMe = async (detectedCity?: string) => {
    if (detectedCity) {
      setCity(detectedCity);
      updateUrlParams({ city: detectedCity });
      return;
    }
    setIsLocating(true);
    try {
      const loc = await detectCurrentCity();
      if (loc.city) {
        setCity(loc.city);
        updateUrlParams({ city: loc.city });
      }
    } catch (err) {
      console.error("Location detection error in JobSearchPage:", err);
    } finally {
      setIsLocating(false);
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    setQuery('');
    setCity('');
    setJobType('All');
    setBudgetRange('all');
    setExperience('all');
    setTrade('All');
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = (jobType !== 'All' ? 1 : 0) + (budgetRange !== 'all' ? 1 : 0) + (experience !== 'all' ? 1 : 0) + (trade !== 'All' ? 1 : 0) + (city ? 1 : 0);
  const hasActiveFilters = Boolean(query || city || jobType !== 'All' || budgetRange !== 'all' || experience !== 'all' || trade !== 'All');

  const TRADE_CATEGORIES = [
    'All',
    'Construction',
    'Facility Management',
    'Logistics',
    'Manufacturing',
    'Security',
    'Hospitality',
    'Retail',
    'Agriculture'
  ];

  // Format job data for rendering
  const formattedJobs: JobCardData[] = useMemo(() => {
    return jobs.map((j: any) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      industry: j.industry,
      jobType: j.jobType || 'Full Time',
      location: j.location,
      city: j.city,
      budget: j.budget,
      experienceYearsRequired: j.experienceYearsRequired ?? j.experience_years_required ?? 0,
      status: j.status,
      createdAt: j.createdAt || j.created_at,
      employerProfile: j.employerProfile,
      hasApplied: appliedJobIdsMap.has(j.id),
      applicationStatus: appliedJobIdsMap.get(j.id),
    }));
  }, [jobs, appliedJobIdsMap]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-[#0A1931]">
      
      {/* 1. Header Hero Banner with Dual Search */}
      <JobSearchHero
        title="Find your dream job"
        subtitle="Explore thousands of verified openings with instant pay and vetted employers."
        initialQuery={query}
        initialCity={city}
        onSearch={handleSearch}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* 2. Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Mobile Quick Filter Action Row (Visible on Mobile Only) */}
        <div className="lg:hidden mb-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 font-['Outfit',sans-serif]">
              <strong className="text-slate-900 font-extrabold">{formattedJobs.length}</strong> openings found
            </span>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#0A1931] shadow-xs active:scale-95 transition-all cursor-pointer font-['Outfit',sans-serif]"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Filter Jobs</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white text-[10px] font-extrabold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Trade Horizontal Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TRADE_CATEGORIES.map((cat) => {
              const isSelected = trade === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setTrade(cat);
                    updateUrlParams({ trade: cat });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP LEFT COLUMN: Filters Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs sticky top-4">
            <JobFilterSidebar
              selectedJobType={jobType}
              onSelectJobType={(t) => {
                setJobType(t);
                updateUrlParams({ type: t });
              }}
              selectedLocation={city}
              onSelectLocation={(l) => {
                setCity(l);
                updateUrlParams({ city: l });
              }}
              selectedBudget={budgetRange}
              onSelectBudget={(b) => {
                setBudgetRange(b);
                updateUrlParams({ budget: b });
              }}
              selectedExperience={experience}
              onSelectExperience={(e) => {
                setExperience(e);
                updateUrlParams({ exp: e });
              }}
              selectedTrade={trade}
              onSelectTrade={(tr) => {
                setTrade(tr);
                updateUrlParams({ trade: tr });
              }}
              counts={filterCounts}
              onClearAll={handleClearAll}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* CENTER COLUMN: Feed (Full width on mobile, 6 cols on desktop) */}
          <div className="col-span-1 lg:col-span-6 space-y-5">
            
            {/* Top Promo Banner: Upload Resume */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/90 shadow-xs flex items-center justify-between gap-4 bg-linear-to-r from-blue-50/70 to-white">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0 border border-blue-200">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0A1931] font-['Outfit',sans-serif]">
                    Upload your resume
                  </h4>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    We'll match you with the best jobs. Right job, Right away!
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="px-3.5 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-bold text-xs shrink-0 transition-all shadow-2xs font-['Outfit',sans-serif]"
              >
                Upload
              </Link>
            </div>

            {/* Results Count & Sort Row */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-500 font-['Outfit',sans-serif]">
                <strong className="text-slate-900 font-extrabold">{formattedJobs.length}</strong> results found
              </span>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0066FF] cursor-pointer"
                >
                  <option value="date_desc">Date Posted</option>
                  <option value="salary_desc">Highest Pay</option>
                  <option value="salary_asc">Lowest Pay</option>
                </select>
              </div>
            </div>

            {/* Job List Feed */}
            {isLoading ? (
              <AppLoader variant="skeleton" />
            ) : formattedJobs.length > 0 ? (
              <div className="space-y-4">
                {formattedJobs.map((job) => (
                  <JobSearchResultCard
                    key={job.id}
                    job={job}
                    onApply={(jobId) => applyMutation.mutate(jobId)}
                    isApplying={applyMutation.isPending && applyMutation.variables === job.id}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                    No matching jobs found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your filters, searching for a different title, or clearing active filters to see all available openings.
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-[#0066FF] text-white rounded-xl font-bold text-xs hover:bg-[#0052CC] transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </button>
                )}
              </div>
            )}

          </div>

          {/* DESKTOP RIGHT COLUMN: Contextual Widgets Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-4">
            <JobSearchRightSidebar
              currentCity={city}
              onSelectCompany={(comp) => {
                setQuery(comp);
                updateUrlParams({ q: comp });
              }}
            />
          </div>

        </div>
      </div>

      {/* 3. Mobile Filter Bottom-Sheet / Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-base font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  Filter Job Openings
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-bold text-slate-500 hover:text-[#0066FF] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="hidden" />
                  <span className="text-base font-bold">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Filters */}
            <div className="px-6 py-5 overflow-y-auto space-y-6">
              
              {/* Job Type Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Job Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Daily Gig'].map((t) => {
                    const isSelected = jobType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setJobType(t);
                          updateUrlParams({ type: t });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0066FF] text-white shadow-xs'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trade Category Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Trade / Industry
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRADE_CATEGORIES.map((cat) => {
                    const isSelected = trade === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setTrade(cat);
                          updateUrlParams({ trade: cat });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0066FF] text-white shadow-xs'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pay Range Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Pay / Daily Budget
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'All Pay Ranges', value: 'all' },
                    { label: 'Under ₹1,000 / day', value: 'under1000' },
                    { label: '₹1,000 - ₹2,500 / day', value: '1000to2500' },
                    { label: '₹2,500 - ₹5,000 / day', value: '2500to5000' },
                    { label: '₹5,000+ / day', value: 'above5000' }
                  ].map((b) => {
                    const isSelected = budgetRange === b.value;
                    return (
                      <button
                        key={b.value}
                        onClick={() => {
                          setBudgetRange(b.value);
                          updateUrlParams({ budget: b.value });
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-[#0066FF] border border-[#0066FF]/30'
                            : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{b.label}</span>
                        {isSelected && <span className="text-[#0066FF] font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience Required Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Experience Level
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'All Experience Levels', value: 'all' },
                    { label: '0 to 1 Year (Entry)', value: '0-1' },
                    { label: '1 to 3 Years (Junior)', value: '1-3' },
                    { label: '3 to 5 Years (Mid)', value: '3-5' },
                    { label: '5+ Years (Senior)', value: '5+' }
                  ].map((exp) => {
                    const isSelected = experience === exp.value;
                    return (
                      <button
                        key={exp.value}
                        onClick={() => {
                          setExperience(exp.value);
                          updateUrlParams({ exp: exp.value });
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-[#0066FF] border border-[#0066FF]/30'
                            : 'bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{exp.label}</span>
                        {isSelected && <span className="text-[#0066FF] font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer: Sticky Action Button */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 shrink-0">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-2xl text-xs font-extrabold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
              >
                Show {formattedJobs.length} Jobs
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
