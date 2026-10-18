import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchService } from '../../../services/search.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
import { queryKeys } from '../../../lib/queryKeys';
import { 
  Briefcase, 
  UploadCloud, 
  RotateCcw,
  ChevronDown,
  Bell,
  Check
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { JobSearchHero } from '../components/JobSearchHero';
import { JobFilterSidebar, type FilterCounts } from '../components/JobFilterSidebar';
import { JobSearchResultCard, type JobCardData } from '../components/JobSearchResultCard';
import { JobSearchRightSidebar } from '../components/JobSearchRightSidebar';
import { AppLoader } from '../../../components/common/AppLoader';
import { detectCurrentCity } from '../../../utils/geolocation';
import { useAuth } from '../../../providers/AuthContext';
import { fcmService } from '../../../services/fcm.service';
import { searchAlertService } from '../../../services/searchAlert.service';
import { ManageAlertsModal } from '../../dashboard/features/alerts/ManageAlertsModal';

export default function JobSearchPage() {
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
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAlertSaved, setIsAlertSaved] = useState(false);

  const { user } = useAuth();

  const handleSaveSearchAlert = async () => {
    if (!user) {
      alert("Please sign in or create an account to save job search alerts.");
      return;
    }

    // Prompt native browser push notification permission if not yet granted
    if (fcmService.isPushSupported() && Notification.permission !== 'granted') {
      await fcmService.requestPushPermissionAndRegister().catch(() => {});
    }

    try {
      await searchAlertService.createAlert({
        alertType: 'JOB_ALERT',
        city: city || undefined,
        category: trade !== 'All' ? trade : undefined,
        query: query || undefined,
        minSalary: minSalary || undefined,
        frequency: 'INSTANT'
      });
      setIsAlertSaved(true);
      setTimeout(() => setIsAlertSaved(false), 4000);
      queryClient.invalidateQueries({ queryKey: ['searchAlerts'] });
    } catch (e: any) {
      console.warn("Save alert error:", e);
    }
  };

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
  useQuery({
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
    <div className="w-full min-h-screen p-2 sm:p-3 bg-white font-['Onest',system-ui,sans-serif] text-[#0a0a0a]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. Header Hero Banner Replicating Landing Page Navy Editorial Aesthetic */}
        <JobSearchHero
          initialQuery={query}
          initialCity={city}
          totalJobs={formattedJobs.length}
          selectedTrade={trade}
          onTradeSelect={(t) => {
            setTrade(t);
            updateUrlParams({ trade: t });
          }}
          onSearch={handleSearch}
          onLocateMe={handleLocateMe}
          isLocating={isLocating}
        />

        {/* 2. Mobile Quick Filter Action Row (Visible on Mobile Only) */}
        <div className="lg:hidden px-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#717784]">
              <strong className="text-[#0a0a0a] font-bold">{formattedJobs.length}</strong> verified openings
            </span>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#f4f4f4] hover:bg-[#e6e8ec] border border-[#e6e8ec] rounded-full text-xs font-medium uppercase text-[#0a0a0a] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#0f2f63]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0f2f63] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Main 3-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* DESKTOP LEFT COLUMN: Filters Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3 bg-[#f4f4f4] rounded-[1.75rem] p-5 sm:p-6 border border-[#e6e8ec] lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
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
            <div className="bg-[#f4f4f4] rounded-[1.5rem] p-4 sm:p-5 border border-[#e6e8ec] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white text-[#0f2f63] flex items-center justify-center shrink-0 border border-[#e6e8ec] shadow-2xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#0a0a0a]">
                    Upload your resume
                  </h4>
                  <p className="text-xs text-[#717784] font-medium truncate">
                    AI-powered smart matching with verified employers and guaranteed payouts.
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="px-4 py-2 bg-[#0f2f63] hover:bg-[#1a4487] text-white rounded-full font-medium text-xs shrink-0 transition-all shadow-xs cursor-pointer active:scale-95 uppercase"
              >
                Upload
              </Link>
            </div>

            {/* Results Count & Sort Row */}
            <div className="flex items-center justify-between px-1 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#717784]">
                  Showing <strong className="text-[#0a0a0a] font-bold">{formattedJobs.length}</strong> verified job postings
                </span>
                <button
                  type="button"
                  onClick={handleSaveSearchAlert}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                    isAlertSaved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white hover:bg-[#0f2f63] text-[#0f2f63] hover:text-white border-[#0f2f63]/30 shadow-2xs'
                  }`}
                >
                  {isAlertSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Alert Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-[#2563c9]" />
                      <span>Alert Me on New Jobs</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#717784] font-medium">Sort by:</span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-[#f4f4f4] hover:bg-[#e6e8ec] border border-[#e6e8ec] rounded-full pl-3.5 pr-8 py-1.5 text-xs font-medium text-[#0a0a0a] focus:outline-none focus:border-[#0f2f63] cursor-pointer transition-colors"
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="salary_desc">Highest Pay</option>
                    <option value="salary_asc">Lowest Pay</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#717784] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
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
              <div className="bg-[#f4f4f4] rounded-[1.75rem] p-10 border border-[#e6e8ec] text-center space-y-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#717784] border border-[#e6e8ec] shadow-2xs">
                  <Briefcase className="w-7 h-7 text-[#0f2f63]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0a0a0a]">
                    No matching jobs found
                  </h3>
                  <p className="text-xs text-[#717784] max-w-sm mx-auto">
                    Try adjusting your filters, searching for a different trade or city, or resetting active filters to view all available verified positions.
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-[#0f2f63] hover:bg-[#1a4487] text-white rounded-full font-medium text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs active:scale-95 uppercase"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </button>
                )}
              </div>
            )}

          </div>

          {/* DESKTOP RIGHT COLUMN: Contextual Widgets Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 lg:sticky lg:top-4 lg:self-start">
            <JobSearchRightSidebar
              currentCity={city}
              currentTrade={trade}
              currentQuery={query}
              minSalary={minSalary}
              onSelectCompany={(comp) => {
                setQuery(comp);
                updateUrlParams({ q: comp });
              }}
            />
          </div>

        </div>
      </div>

      {/* 4. Mobile Filter Bottom-Sheet / Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] max-h-[88vh] flex flex-col shadow-2xl border border-[#e6e8ec] overflow-hidden animate-in slide-in-from-bottom duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#e6e8ec] flex items-center justify-between shrink-0 bg-[#fbfbfb]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0f2f63]" />
                <h3 className="text-base font-bold text-[#0a0a0a]">
                  Filter Job Openings
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-medium text-[#717784] hover:text-[#0f2f63] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-[#717784] hover:text-[#0a0a0a] rounded-full hover:bg-[#e6e8ec] transition-colors cursor-pointer"
                >
                  <span className="text-base font-bold leading-none">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Filters */}
            <div className="px-6 py-5 overflow-y-auto space-y-6">
              
              {/* Job Type Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase text-[#717784]">
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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f2f63] text-white shadow-xs'
                            : 'bg-[#f4f4f4] hover:bg-[#e6e8ec] border border-[#e6e8ec] text-[#0a0a0a]'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase text-[#717784]">
                  Industry Category
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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f2f63] text-white shadow-xs'
                            : 'bg-[#f4f4f4] hover:bg-[#e6e8ec] border border-[#e6e8ec] text-[#0a0a0a]'
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
                <label className="text-[11px] font-bold uppercase text-[#717784]">
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
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f2f63] text-white'
                            : 'bg-[#f4f4f4] hover:bg-[#e6e8ec] border border-[#e6e8ec] text-[#0a0a0a]'
                        }`}
                      >
                        <span>{b.label}</span>
                        {isSelected && <span className="text-white font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience Required Filter */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase text-[#717784]">
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
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f2f63] text-white'
                            : 'bg-[#f4f4f4] hover:bg-[#e6e8ec] border border-[#e6e8ec] text-[#0a0a0a]'
                        }`}
                      >
                        <span>{exp.label}</span>
                        {isSelected && <span className="text-white font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer: Sticky Action Button */}
            <div className="p-4 border-t border-[#e6e8ec] bg-[#fbfbfb] shrink-0">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#0f2f63] hover:bg-[#1a4487] text-white rounded-full text-xs font-bold shadow-md shadow-[#0f2f63]/20 transition-all cursor-pointer uppercase active:scale-95"
              >
                Show {formattedJobs.length} Jobs
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Manage Alerts Modal */}
      <ManageAlertsModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alertType="JOB_ALERT"
      />

    </div>
  );
}

