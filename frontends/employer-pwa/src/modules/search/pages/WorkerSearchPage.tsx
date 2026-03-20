import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchWorkers, type WorkerSearch } from '../api/search.service';
import { Search, MapPin, Award, UserCheck, ShieldCheck, Filter, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WorkerSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [skills, setSkills] = useState(searchParams.get('skills') || '');

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('city') || '';
    const l = searchParams.get('level') || '';
    const s = searchParams.get('skills') || '';
    setQuery(q);
    setCity(c);
    setLevel(l);
    setSkills(s);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ['workerSearch', query, city, level, skills],
    queryFn: () => searchWorkers(query, undefined, city, level, undefined, undefined, undefined, skills),
    enabled: true
  });

  return (
    <>
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      {/* Search Header Section */}
      <div className="bg-white border-b border-brand-border sticky top-0 md:top-0 z-30 px-6 py-6 md:py-8 md:px-12 shadow-2xl backdrop-blur-3xl bg-white/80">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight leading-none uppercase">Talent Pool</h1>
                    <p className="text-brand-primary text-[9px] md:text-[10px] font-semibold uppercase tracking-widest mt-2">Verified Professional Database</p>
                </div>
                <div className="flex items-center gap-3 bg-brand-bg px-4 py-2 rounded-xl border border-brand-border h-fit">
                    <Filter className="w-4 h-4 text-brand-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Search Filters</span>
                </div>
            </div>
          
          <div className="bg-white border border-brand-border rounded-3xl md:rounded-[2.5rem] shadow-2xl p-4 md:p-2 flex flex-col md:flex-row items-stretch gap-2 group transition-all focus-within:ring-4 focus-within:ring-brand-primary/10">
            <div className="flex-[2] relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
              <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    updateSearchParams({ q: e.target.value });
                }}
                placeholder="Search name or title"
                className="w-full bg-transparent py-3 md:py-5 pl-16 pr-6 focus:outline-none font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
              />
            </div>
            <div className="hidden md:block w-px bg-brand-border my-4" />
            <div className="flex-1 relative">
              <input
                value={skills}
                onChange={(e) => {
                    setSkills(e.target.value);
                    updateSearchParams({ skills: e.target.value });
                }}
                placeholder="Skills"
                className="w-full bg-transparent py-3 md:py-5 px-6 focus:outline-none font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
              />
            </div>
            <div className="hidden md:block w-px bg-brand-border my-4" />
            <div className="flex-1 relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-secondary/20 group-focus-within:text-brand-primary transition-colors w-5 h-5" />
              <input
                value={city}
                onChange={(e) => {
                    setCity(e.target.value);
                    updateSearchParams({ city: e.target.value });
                }}
                placeholder="City"
                className="w-full bg-transparent py-3 md:py-5 pl-16 pr-6 focus:outline-none font-semibold text-sm placeholder:text-brand-muted/20 text-brand-secondary"
              />
            </div>
            <div className="hidden md:block w-px bg-brand-border my-4" />
            <div className="w-40 relative">
                <select
                value={level}
                onChange={(e) => {
                    setLevel(e.target.value);
                    updateSearchParams({ level: e.target.value });
                }}
                className="w-full bg-transparent py-3 md:py-5 px-6 focus:outline-none text-brand-secondary font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                >
                <option value="">Lvl (All)</option>
                <option value="L4">Master (L4)</option>
                <option value="L3">Expert (L3)</option>
                <option value="L2">Skilled (L2)</option>
                <option value="L1">Beginner (L1)</option>
                </select>
            </div>
            <button className="bg-brand-secondary text-brand-primary py-3 md:py-0 px-8 rounded-2xl md:rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group/btn">
                Find <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <Loader2 className="h-14 w-14 text-brand-primary animate-spin" />
             <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Searching...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {results?.map((worker: WorkerSearch, idx: number) => (
              <motion.div 
                key={worker.userId} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-brand-surface border border-brand-border rounded-3xl md:rounded-4xl p-6 md:p-8 hover:border-brand-primary/40 transition-all group overflow-hidden relative shadow-2xl cursor-pointer"
                onClick={() => navigate(`/worker/${worker.userId}`)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <ShieldCheck className="h-28 w-28 text-brand-primary" />
                </div>
                
                <div className="flex items-start gap-5 mb-6">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-3xl bg-brand-secondary text-brand-primary flex items-center justify-center text-2xl md:text-3xl font-bold shadow-2xl group-hover:scale-105 transition-transform border border-brand-secondary">
                    {worker.name[0]}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl md:text-2xl font-bold text-brand-secondary uppercase tracking-tight leading-tight">{worker.name}</h3>
                      {worker.isVerified && <UserCheck className="h-4 w-4 text-brand-primary" />}
                    </div>
                    <p className="text-brand-muted text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-brand-primary" /> {worker.city || worker.location}
                    </p>
                  </div>
                </div>

                <p className="text-brand-muted font-bold text-sm line-clamp-2 mb-6 h-10 leading-tight uppercase tracking-tight">
                  {worker.bio || "No professional briefing available for this operative."}
                </p>

                <div className="flex flex-wrap gap-2 mb-8 min-h-[56px] content-start">
                  {worker.skills.split(',').slice(0, 3).map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-brand-secondary text-brand-primary text-[10px] font-semibold uppercase tracking-widest rounded-lg border border-brand-secondary shadow-md">
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-brand-border/30">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-brand-primary" />
                    <span className="text-sm font-semibold text-brand-secondary uppercase tracking-widest">Rank {worker.level}</span>
                  </div>
                  <button 
                    className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-brand-secondary group-hover:text-brand-primary transition-colors"
                  >
                    View Profile <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
            {(!results || results.length === 0) && (
              <div className="col-span-full text-center py-32 bg-brand-surface rounded-4xl border border-dashed border-brand-border/50">
                <div className="w-24 h-24 bg-brand-secondary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-10 h-10 text-brand-muted/30" />
                </div>
                <h3 className="text-3xl font-bold text-neutral-900 uppercase tracking-tight mb-2">No Results Found</h3>
                <p className="text-brand-muted font-medium uppercase tracking-widest text-xs">Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
