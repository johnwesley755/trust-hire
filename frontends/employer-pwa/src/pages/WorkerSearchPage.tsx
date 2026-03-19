import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchWorkers, type WorkerSearch } from '../api/search.service';
import { Search, MapPin, Award, UserCheck, ShieldCheck, Filter, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WorkerSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState('');
  const [radius, setRadius] = useState('5');
  const [skills, setSkills] = useState('');

  const { data: results, isLoading } = useQuery({
    queryKey: ['workerSearch', query, location, level, radius, skills],
    queryFn: () => searchWorkers(query, location, level, radius, skills),
    enabled: true
  });

  return (
    <>
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      {/* Search Header Section */}
      <div className="bg-white border-b border-brand-border sticky top-0 md:top-0 z-30 px-6 py-8 md:px-12 shadow-2xl backdrop-blur-3xl bg-white/80">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight leading-none uppercase">Talent Pool</h1>
                    <p className="text-brand-primary text-[10px] font-semibold uppercase tracking-widest mt-2">Verified Professional Database</p>
                </div>
                <div className="flex items-center gap-3 bg-brand-bg px-4 py-2 rounded-xl border border-brand-border h-fit">
                    <Filter className="w-4 h-4 text-brand-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Search Filters</span>
                </div>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="relative md:col-span-4 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/40 group-focus-within:text-brand-primary h-5 w-5 transition-colors" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or title"
                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium placeholder:text-brand-muted/20 shadow-inner"
              />
            </div>
            <div className="relative md:col-span-2">
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Skills"
                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium placeholder:text-brand-muted/20 shadow-inner"
              />
            </div>
            <div className="relative md:col-span-2 group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/40 group-focus-within:text-brand-primary h-5 w-5 transition-colors" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-5 pl-12 pr-4 focus:outline-none focus:border-brand-primary text-brand-secondary font-medium placeholder:text-brand-muted/20 shadow-inner"
              />
            </div>
            <div className="relative md:col-span-2">
                <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary text-brand-secondary font-black text-xs uppercase tracking-widest appearance-none cursor-pointer shadow-inner"
                >
                <option value="5">05 KM Range</option>
                <option value="10">10 KM Range</option>
                <option value="25">25 KM Range</option>
                <option value="50">50 KM Range</option>
                </select>
            </div>
            <div className="relative md:col-span-2">
                <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-5 px-6 focus:outline-none focus:border-brand-primary text-brand-secondary font-black text-xs uppercase tracking-widest appearance-none cursor-pointer shadow-inner"
                >
                <option value="">Lvl (All)</option>
                <option value="L4">Master (L4)</option>
                <option value="L3">Expert (L3)</option>
                <option value="L2">Skilled (L2)</option>
                <option value="L1">Beginner (L1)</option>
                </select>
            </div>
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
                className="bg-brand-surface border border-brand-border rounded-4xl p-8 hover:border-brand-primary/40 transition-all group overflow-hidden relative shadow-2xl cursor-pointer"
                onClick={() => navigate(`/worker/${worker.userId}`)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <ShieldCheck className="h-28 w-28 text-brand-primary" />
                </div>
                
                <div className="flex items-start gap-5 mb-6">
                  <div className="h-20 w-20 rounded-3xl bg-brand-secondary text-brand-primary flex items-center justify-center text-3xl font-bold shadow-2xl group-hover:scale-105 transition-transform border border-brand-secondary">
                    {worker.name[0]}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-brand-secondary uppercase tracking-tight leading-tight">{worker.name}</h3>
                      {worker.isVerified && <UserCheck className="h-4 w-4 text-brand-primary" />}
                    </div>
                    <p className="text-brand-muted text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-brand-primary" /> {worker.location}
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
