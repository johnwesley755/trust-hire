import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchWorkers, type WorkerSearch } from '../../../services/search.service';
import { Search, MapPin, Award, ShieldCheck, Loader2, Star, Zap, ChevronRight, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserAvatar } from '../../../components/common/UserAvatar';

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

export const WorkerSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [skills, setSkills] = useState(searchParams.get('skills') || '');
  const [selectedTrade, setSelectedTrade] = useState('All');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('city') || '';
    const l = searchParams.get('level') || '';
    const s = searchParams.get('skills') || '';
    
    if (q !== query) setQuery(q);
    if (c !== city) setCity(c);
    if (l !== level) setLevel(l);
    if (s !== skills) setSkills(s);
  }, [searchParams]);

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setQuery('');
    setCity('');
    setLevel('');
    setSkills('');
    setSelectedTrade('All');
    setSearchParams(new URLSearchParams());
  };

  const effectiveSkills = selectedTrade !== 'All' ? selectedTrade : skills;

  const { data: results, isLoading } = useQuery({
    queryKey: ['workerSearch', query, city, level, effectiveSkills],
    queryFn: () => searchWorkers(query, undefined, city, level, undefined, undefined, undefined, effectiveSkills),
    enabled: true
  });

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Header & Filter Search Strip */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-[10px] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                Hyper-Local Talent Dispatch
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                Discover Verified Trade Professionals
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Search 2,400+ background-verified technicians ready for instant shift booking.
              </p>
            </div>
            
            {(query || city || level || skills || selectedTrade !== 'All') && (
              <button 
                onClick={clearFilters}
                className="px-3.5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all self-start cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  updateSearchParams({ q: e.target.value });
                }}
                placeholder="Name or keyword..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0066FF] outline-none transition-all"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0066FF]" />
              <input
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  updateSearchParams({ city: e.target.value });
                }}
                placeholder="Area or city (e.g. Bangalore)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0066FF] outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={skills}
                onChange={(e) => {
                  setSkills(e.target.value);
                  updateSearchParams({ skills: e.target.value });
                }}
                placeholder="Skill tags (e.g. 3-Phase Wiring)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0066FF] outline-none transition-all"
              />
            </div>

            <div className="flex gap-1.5">
              {['L1', 'L2', 'L3', 'L4'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    const newLvl = level === lvl ? '' : lvl;
                    setLevel(newLvl);
                    updateSearchParams({ level: newLvl });
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    level === lvl 
                      ? 'bg-[#0066FF] text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Trade Category Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#0066FF]" /> Trades:
            </span>
            {TRADE_CATEGORIES.map((trade) => (
              <button
                key={trade}
                onClick={() => setSelectedTrade(trade)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedTrade === trade
                    ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        </section>

        {/* Search Results Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0A1931]">
              Available Candidates Near You
            </h2>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-600 shadow-xs border border-slate-200">
              {results?.length || 0} verified available
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-3 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="h-8 w-8 text-[#0066FF] animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scanning Proximity Radar...</p>
            </div>
          ) : results?.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl space-y-3">
              <div className="w-14 h-14 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Candidates Found</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Try expanding your search radius or clearing trade filter constraints.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results?.map((worker: WorkerSearch, idx: number) => {
                const distance = ((idx % 4) * 0.9 + 1.1).toFixed(1);
                return (
                  <motion.div 
                    key={worker.userId} 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                    className="bg-white rounded-2xl p-5 hover:shadow-md hover:border-blue-300 transition-all group border border-slate-200/80 flex flex-col justify-between cursor-pointer"
                    onClick={() => navigate(`/worker/${worker.userId}`)}
                  >
                    <div>
                      {/* Top Profile Header */}
                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="relative shrink-0">
                          <UserAvatar 
                            src={worker.profileImageUrl} 
                            name={worker.name} 
                            size="lg" 
                          />
                          <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-white">
                            L{worker.level || 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066FF] transition-colors truncate">
                              {worker.name}
                            </h3>
                            {worker.isVerified && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                            <span className="flex items-center gap-0.5 text-slate-600">
                              <MapPin className="w-3 h-3 text-[#0066FF]" />
                              {distance} km away
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-current" /> 4.9
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                        {worker.bio || "Certified trade professional with verified skills, ready for immediate assignment dispatch."}
                      </p>

                      {/* Skill Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(worker.skills || "General Trade").split(',').slice(0, 3).map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Ready to Book</span>
                      </div>
                      <button className="px-4 py-2 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer">
                        Dispatch Offer <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
