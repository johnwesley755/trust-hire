import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { searchJobs } from '../../../services/search.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
import { 
  Search, 
  Loader2, 
  Sparkles, 
  SlidersHorizontal, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Navigation, 
  Flame, 
  X, 
  Check, 
  RotateCcw,
  LocateFixed
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { JobSearchHero } from '../components/JobSearchHero';
import { JobSearchResultCard } from '../components/JobSearchResultCard';

const TRADE_CATEGORIES = [
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

const BUDGET_RANGES = [
  { label: "All Pay Ranges", value: "all" },
  { label: "Under ₹1,000", value: "under1000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹2,500", value: "1000to2500", min: 1000, max: 2500 },
  { label: "₹2,500 - ₹5,000", value: "2500to5000", min: 2500, max: 5000 },
  { label: "₹5,000+", value: "above5000", min: 5000, max: 9999999 }
];

const RADIUS_OPTIONS = [
  { label: "Any Distance", value: 0 },
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
  { label: "Within 25 km", value: 25 },
  { label: "Within 50 km", value: 50 }
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedRadius, setSelectedRadius] = useState<number>(0);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  const updateSearchParams = (newQuery: string, newCity: string) => {
    const params: Record<string, string> = {};
    if (newQuery) params.q = newQuery;
    if (newCity) params.city = newCity;
    setSearchParams(params);
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['jobSearch', query, city, selectedTrade],
    queryFn: () => searchJobs(query || undefined, undefined, city || undefined, selectedTrade !== 'All' ? selectedTrade : undefined),
    enabled: Boolean(query || city || selectedTrade !== 'All'),
  });

  const { data: allJobs = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['allJobs'],
    queryFn: () => jobService.getAllJobs(),
  });

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  // Seed user coordinates from worker profile if present
  useEffect(() => {
    if (profile?.latitude && profile?.longitude && !userCoords) {
      setUserCoords({ lat: profile.latitude, lon: profile.longitude });
      if (!city && profile.city) {
        setCity(profile.city);
      }
    }
  }, [profile]);

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

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (res.ok) {
            const data = await res.json();
            const detectedCity = data.address?.city || data.address?.town || data.address?.suburb || data.address?.state_district;
            if (detectedCity) {
              setCity(detectedCity);
              updateSearchParams(query, detectedCity);
            }
          }
        } catch {
          // fallback
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        alert("Please enable location access in your browser settings to match nearby openings.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleApply = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const resetAllFilters = () => {
    setSelectedTrade('All');
    setSelectedBudget('all');
    setSelectedRadius(0);
    setUrgentOnly(false);
    setQuery('');
    setCity('');
    setActiveTab('all');
    setSearchParams({});
  };

  const appliedJobIds = new Set(Array.isArray(myApplications) ? myApplications.map((app) => app.jobId) : []);
  const isSearchActive = Boolean((query && query.trim()) || (city && city.trim()) || selectedTrade !== 'All');
  const baseJobsList = isSearchActive && searchResults ? searchResults : (Array.isArray(allJobs) ? allJobs : []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedTrade !== 'All') count++;
    if (selectedBudget !== 'all') count++;
    if (selectedRadius > 0) count++;
    if (urgentOnly) count++;
    if (query.trim()) count++;
    return count;
  }, [selectedTrade, selectedBudget, selectedRadius, urgentOnly, query]);

  // Compute matched, distance-calculated, filtered and recommended jobs
  const displayJobs = useMemo(() => {
    // 1. Enrich jobs with distance
    let list = baseJobsList.map((j: any) => {
      let distanceKm: number | null = null;
      if (userCoords && j.latitude && j.longitude) {
        distanceKm = getDistanceKm(userCoords.lat, userCoords.lon, j.latitude, j.longitude);
      }
      return {
        ...j,
        _distanceKm: distanceKm,
      };
    });

    // 2. Filter by search query keyword
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(j => 
        j.title?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.industry?.toLowerCase().includes(q) ||
        j.skills?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.city?.toLowerCase().includes(q)
      );
    }

    // 3. Filter by Trade
    if (selectedTrade !== 'All') {
      const term = selectedTrade.toLowerCase();
      list = list.filter(j => 
        j.title?.toLowerCase().includes(term) ||
        j.skills?.toLowerCase().includes(term) ||
        j.industry?.toLowerCase().includes(term) ||
        j.description?.toLowerCase().includes(term)
      );
    }

    // 3. Filter by Budget / Pay Range
    if (selectedBudget !== 'all') {
      const range = BUDGET_RANGES.find(r => r.value === selectedBudget);
      if (range) {
        list = list.filter(j => {
          const budget = Number(j.budget) || 0;
          return budget >= range.min! && budget <= range.max!;
        });
      }
    }

    // 4. Filter by Radius
    if (selectedRadius > 0) {
      list = list.filter(j => {
        if (typeof j._distanceKm === 'number') {
          return j._distanceKm <= selectedRadius;
        }
        // Fallback to city match if coords missing
        if (city && j.city) {
          return j.city.toLowerCase().includes(city.toLowerCase());
        }
        return true;
      });
    }

    // 5. Filter by Urgency
    if (urgentOnly) {
      list = list.filter(j => j.description?.toLowerCase().includes('urgent') || j.status === 'URGENT');
    }

    // 6. Recommendation tab scoring & prioritization
    if (activeTab === 'recommended') {
      const candidateSkills = (profile?.skills || '').toLowerCase().split(',').map((s: string) => s.trim()).filter(Boolean);
      const candidateCity = (city || profile?.city || profile?.location || '').toLowerCase();

      return [...list].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Proximity score (nearest gets up to 100 points)
        if (typeof a._distanceKm === 'number') {
          scoreA += Math.max(0, 100 - a._distanceKm * 2);
        } else if (candidateCity && a.city?.toLowerCase().includes(candidateCity)) {
          scoreA += 60;
        }

        if (typeof b._distanceKm === 'number') {
          scoreB += Math.max(0, 100 - b._distanceKm * 2);
        } else if (candidateCity && b.city?.toLowerCase().includes(candidateCity)) {
          scoreB += 60;
        }

        // Skills match score
        if (candidateSkills.length > 0) {
          const matchA = candidateSkills.some((s: string) => 
            a.title?.toLowerCase().includes(s) || a.skills?.toLowerCase().includes(s) || a.industry?.toLowerCase().includes(s)
          );
          if (matchA) scoreA += 50;

          const matchB = candidateSkills.some((s: string) => 
            b.title?.toLowerCase().includes(s) || b.skills?.toLowerCase().includes(s) || b.industry?.toLowerCase().includes(s)
          );
          if (matchB) scoreB += 50;
        }

        // Urgency score
        if (a.description?.toLowerCase().includes('urgent')) scoreA += 20;
        if (b.description?.toLowerCase().includes('urgent')) scoreB += 20;

        return scoreB - scoreA;
      });
    }

    // "All openings" tab: sort nearest first if coords available
    if (userCoords) {
      return [...list].sort((a, b) => {
        if (a._distanceKm != null && b._distanceKm != null) {
          return a._distanceKm - b._distanceKm;
        }
        if (a._distanceKm != null) return -1;
        if (b._distanceKm != null) return 1;
        return 0;
      });
    }

    return list;
  }, [baseJobsList, selectedTrade, selectedBudget, selectedRadius, urgentOnly, activeTab, profile, userCoords, city]);

  const isLoading = isSearching || isLoadingAll;

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#0F172A]">
      <JobSearchHero 
        query={query}
        city={city}
        totalJobs={allJobs.length}
        isLocating={isLocating}
        onQueryChange={(val) => {
          setQuery(val);
          updateSearchParams(val, city);
        }}
        onCityChange={(val) => {
          setCity(val);
          updateSearchParams(query, val);
        }}
        onDetectLocation={handleDetectLocation}
        onSearch={() => updateSearchParams(query, city)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3.5 relative z-10 -mt-4">
        {/* GPS Proximity Status Bar */}
        {userCoords && (
          <div className="bg-blue-50 border border-blue-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-[#0066FF] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">Location tracking active:</span>
              <span className="text-slate-700 font-medium">
                {city ? `${city} (GPS matched)` : `GPS (${userCoords.lat.toFixed(2)}°, ${userCoords.lon.toFixed(2)}°)`}
              </span>
            </div>
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="font-bold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              {isLocating ? 'Updating...' : 'Refresh location'}
            </button>
          </div>
        )}

        {/* Standard Job Portal Controls Strip: Tabs, Trade Pills & Advanced Filters */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Recommendation Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
              <button
                onClick={() => setActiveTab('recommended')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'recommended'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0066FF]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Recommended for you
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0066FF]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                All openings ({baseJobsList.length})
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-slate-700">
                {displayJobs.length} {displayJobs.length === 1 ? 'opening found' : 'openings found'}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset filters ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          {/* Trade Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#0066FF]" /> Trades:
            </span>
            {TRADE_CATEGORIES.map((trade) => (
              <button
                key={trade}
                onClick={() => setSelectedTrade(trade)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  selectedTrade === trade
                    ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-[#0066FF]'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>

          {/* Secondary Job Portal Filters: Radius, Pay Range, Urgency */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs">
            {/* Radius Selector */}
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 font-medium focus:ring-1 focus:ring-[#0066FF] focus:outline-none"
              >
                {RADIUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Budget / Pay Range Selector */}
            <div className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 font-medium focus:ring-1 focus:ring-[#0066FF] focus:outline-none"
              >
                {BUDGET_RANGES.map((rng) => (
                  <option key={rng.value} value={rng.value}>{rng.label}</option>
                ))}
              </select>
            </div>

            {/* Urgency Toggle */}
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
                urgentOnly
                  ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${urgentOnly ? 'text-red-600 fill-red-600' : 'text-slate-400'}`} />
              Urgent shifts only
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-white rounded-2xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
            <p className="text-xs font-bold text-slate-500">Scanning live openings near you...</p>
          </div>
        ) : displayJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-xl flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No openings matched your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try broadening your distance radius, adjusting trade filters, or clearing specific pay filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="bg-[#0066FF] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-blue-700 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {displayJobs.map((job: any, index: number) => (
                <JobSearchResultCard 
                  key={job.id} 
                  job={job} 
                  index={index} 
                  applied={appliedJobIds.has(job.id)}
                  distanceKm={job._distanceKm}
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
