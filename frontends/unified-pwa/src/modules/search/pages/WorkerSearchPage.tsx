import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchService, type WorkerSearch } from '../../../services/search.service';
import { queryKeys } from '../../../lib/queryKeys';
import { 
  MapPin, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  SlidersHorizontal, 
  CheckCircle2, 
  RotateCcw,
  Users,
  PlusCircle,
  X,
  Check,
  Bookmark
} from 'lucide-react';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { JobSearchHero } from '../../jobs/components/JobSearchHero';
import { AppLoader } from '../../../components/common/AppLoader';
import { useSavedStore } from '../../../hooks/useSavedStore';
import { DataTablePagination } from '../../../components/common/DataTablePagination';

const JOB_CATEGORIES = [
  "All",
  "Construction",
  "Facility Management",
  "Logistics",
  "Manufacturing",
  "Security",
  "Hospitality",
  "Retail",
  "Agriculture"
];

const EXPERIENCE_LEVELS = [
  { value: 'all', label: 'All Experience Levels' },
  { value: '0-1', label: 'Entry Level (0 - 1 Years)' },
  { value: '1-3', label: 'Junior / Associate (1 - 3 Years)' },
  { value: '3-5', label: 'Mid-Level Specialist (3 - 5 Years)' },
  { value: '5+', label: 'Senior / Expert (5+ Years)' },
];

export const WorkerSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [experience, setExperience] = useState(searchParams.get('exp') || 'all');
  const [selectedTrade, setSelectedTrade] = useState(searchParams.get('trade') || 'All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { isWorkerSaved, toggleSaveWorker } = useSavedStore();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('city') || '';
    const exp = searchParams.get('exp') || 'all';
    const tr = searchParams.get('trade') || 'All';
    
    if (q !== query) setQuery(q);
    if (c !== city) setCity(c);
    if (exp !== experience) setExperience(exp);
    if (tr !== selectedTrade) setSelectedTrade(tr);
  }, [searchParams]);

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'All') newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setQuery('');
    setCity('');
    setExperience('all');
    setSelectedTrade('All');
    setSearchParams(new URLSearchParams());
  };

  const { data: results = [], isLoading } = useQuery<WorkerSearch[]>({
    queryKey: queryKeys.workers.search({ 
      q: query, 
      city, 
      trade: selectedTrade !== 'All' ? selectedTrade : undefined,
      experience: experience !== 'all' ? experience : undefined 
    }),
    queryFn: () => searchService.searchWorkers({
      query: query || undefined,
      city: city || undefined,
      trade: selectedTrade !== 'All' ? selectedTrade : undefined,
      experience: experience !== 'all' ? experience : undefined,
    }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 3,
  });

  const activeFilterCount = (experience !== 'all' ? 1 : 0) + (selectedTrade !== 'All' ? 1 : 0) + (city ? 1 : 0);
  const hasActiveFilters = Boolean(query || city || experience !== 'all' || selectedTrade !== 'All');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-[#0A1931]">
      
      {/* 1. Header Hero Banner with Accurate City Detector */}
      <JobSearchHero
        title="Find top verified talent"
        subtitle="Connect with 2,400+ background-checked, pre-evaluated technicians ready for direct hire."
        initialQuery={query}
        initialCity={city}
        onSearch={(q, c) => {
          setQuery(q);
          setCity(c);
          updateSearchParams({ q, city: c });
        }}
      />

      {/* 2. Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Mobile Quick Filter Action Row (Visible on Mobile Only) */}
        <div className="lg:hidden mb-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500">
              <strong className="text-slate-900 font-extrabold">{results.length}</strong> verified specialists
            </span>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#0A1931] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white text-[10px] font-extrabold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Job Category Horizontal Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {JOB_CATEGORIES.map((cat) => {
              const isSelected = selectedTrade === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedTrade(cat);
                    updateSearchParams({ trade: cat });
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
          
          {/* DESKTOP LEFT COLUMN: Talent Filter Sidebar (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
                <h2 className="text-base font-extrabold text-[#0A1931]">
                  Talent Filters
                </h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Job Category */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                INDUSTRY & JOB CATEGORY
              </span>
              <div className="space-y-1">
                {JOB_CATEGORIES.map((cat) => {
                  const isSelected = selectedTrade === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedTrade(cat);
                        updateSearchParams({ trade: cat });
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'text-[#0066FF] font-bold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                EXPERIENCE LEVEL
              </span>
              <div className="space-y-1">
                {EXPERIENCE_LEVELS.map((el) => {
                  const isSelected = experience === el.value;
                  return (
                    <button
                      key={el.value}
                      onClick={() => {
                        setExperience(el.value);
                        updateSearchParams({ exp: el.value });
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'text-[#0066FF] font-bold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <span>{el.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* CANDIDATES FEED: Shows FIRST on mobile and in Center on desktop */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Header Result Count */}
            <div className="flex items-center justify-between px-1 gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500">
                <strong className="text-slate-900 font-extrabold">{results.length}</strong> verified specialists available
              </span>
            </div>

            {/* Worker Feed */}
            {isLoading ? (
              <AppLoader variant="skeleton" />
            ) : results.length > 0 ? (
              <div className="space-y-4">

                    {results
                      .slice((Math.min(currentPage, Math.max(1, Math.ceil(results.length / pageSize))) - 1) * pageSize, Math.min(currentPage, Math.max(1, Math.ceil(results.length / pageSize))) * pageSize)
                      .map((worker: any) => {
                        const skillList = worker.skills 
                          ? worker.skills.split(',').map((s: string) => s.trim()).filter(Boolean) 
                          : [];

                        const displayRole = worker.level && !worker.level.startsWith('L')
                          ? worker.level
                          : worker.experienceYears
                            ? `${worker.experienceYears}+ Yrs Exp`
                            : 'Verified Specialist';

                        return (
                          <div
                            key={worker.userId}
                            onClick={() => navigate(`/worker/${worker.userId}`)}
                            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#0066FF]/60 hover:shadow-lg transition-all duration-200 group cursor-pointer space-y-4"
                          >
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <UserAvatar
                                  src={worker.profileImageUrl || (worker as any).profile_image_url || worker.profilePhoto}
                                  name={worker.name}
                                  size="lg"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h3 className="text-base font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate">
                                      {worker.name}
                                    </h3>
                                    {worker.isVerified && (
                                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                                      <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                                      {worker.city || worker.location || 'Local Area'}
                                    </span>
                                    <span>•</span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-[#0066FF] rounded-md font-bold text-[10px]">
                                      {displayRole}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions: Trust Score & Bookmark */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaveWorker({
                                      userId: worker.userId,
                                      name: worker.name,
                                      profilePhoto: worker.profileImageUrl,
                                      profileImageUrl: worker.profileImageUrl,
                                      skills: skillList,
                                      city: worker.city || worker.location || 'Local Area',
                                      location: worker.location || worker.city || 'Local Area',
                                      experience: worker.experienceYears || 0,
                                      trustScore: worker.trustScore || '98%',
                                      isVerified: worker.isVerified,
                                      bio: worker.bio,
                                    });
                                  }}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                    isWorkerSaved(worker.userId)
                                      ? 'bg-blue-50 border-blue-200 text-[#0066FF]'
                                      : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                  }`}
                                  title={isWorkerSaved(worker.userId) ? 'Remove from Saved' : 'Save Profile'}
                                >
                                  <Bookmark className={`w-4 h-4 ${isWorkerSaved(worker.userId) ? 'fill-current' : ''}`} />
                                </button>

                                {/* TrustScore - Temporarily hidden until TrustScore engine is fully implemented */}
                                {/*
                                <div className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex items-center gap-1 text-xs font-extrabold">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  <span>{worker.trustScore ? `${worker.trustScore}%` : '98%'}</span>
                                </div>
                                */}
                              </div>
                            </div>

                            {/* Bio Snippet */}
                            {worker.bio && (
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {worker.bio}
                              </p>
                            )}

                            {/* Skills Tags */}
                            {skillList.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {skillList.slice(0, 4).map((skill: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {skillList.length > 4 && (
                                  <span className="px-2 py-1 text-slate-400 text-[10px] font-bold">
                                    +{skillList.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Card Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Verified & Ready to Book
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/worker/${worker.userId}`);
                                }}
                                className="px-3.5 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span>View Profile</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                {/* Standardized Pagination Bar */}
                <DataTablePagination
                  currentPage={Math.min(currentPage, Math.max(1, Math.ceil(results.length / pageSize)))}
                  totalPages={Math.max(1, Math.ceil(results.length / pageSize))}
                  totalItems={results.length}
                  pageSize={pageSize}
                  pageSizeOptions={[5, 10, 20, 50]}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  itemName="specialists"
                  className="rounded-2xl border border-slate-200/90 shadow-xs"
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <Users className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">
                    No verified workers found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try loosening your criteria or search across different cities to see available technicians.
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-[#0066FF] text-white rounded-xl font-bold text-xs hover:bg-[#0052CC] transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </button>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Talent Hiring Quick Actions */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            
            {/* Quick Post Job Card */}
            <div className="bg-linear-to-br from-[#0A1931] to-[#0066FF] text-white rounded-2xl p-5 shadow-lg space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#38BDF8]">
                  Direct Hire
                </span>
                <h3 className="text-base font-extrabold mt-0.5">
                  Need multiple workers fast?
                </h3>
                <p className="text-white/80 text-xs font-medium mt-1 leading-relaxed">
                  Post your job requirements and let our matching engine notify verified workers within your area.
                </p>
              </div>

              <Link
                to="/post-job"
                className="w-full py-2.5 px-4 bg-white text-[#0A1931] hover:bg-blue-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-[#0066FF]" />
                <span>Post a Job Opening</span>
              </Link>
            </div>

            {/* Hiring Guarantee Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>TrustHyre Verified Standard</span>
              </div>
              <ul className="text-xs text-slate-500 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Aadhaar & biometric ID verified</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Practical skill assessment validated</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Escrow-protected daily payouts</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* MOBILE FILTER MODAL / BOTTOM SHEET */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-base font-extrabold text-[#0A1931]">
                  Filter Talent
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Job Categories */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Industry & Category
              </span>
              <div className="grid grid-cols-2 gap-2">
                {JOB_CATEGORIES.map((cat) => {
                  const isSelected = selectedTrade === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedTrade(cat)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#0066FF] font-bold border border-blue-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Levels */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Experience Level
              </span>
              <div className="space-y-1.5">
                {EXPERIENCE_LEVELS.map((el) => {
                  const isSelected = experience === el.value;
                  return (
                    <button
                      key={el.value}
                      onClick={() => setExperience(el.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#0066FF] font-bold border border-blue-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <span>{el.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  updateSearchParams({ trade: selectedTrade, exp: experience });
                  setIsMobileFilterOpen(false);
                }}
                className="flex-2 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
