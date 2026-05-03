import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchWorkers, type WorkerSearch } from '../../../services/search.service';
import { Search, MapPin, Award, ShieldCheck, Loader2 } from 'lucide-react';
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
    
    // Avoid redundant state updates
    if (q !== query) setQuery(q);
    if (c !== city) setCity(c);
    if (l !== level) setLevel(l);
    if (s !== skills) setSkills(s);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setSearchParams(new URLSearchParams());
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ['workerSearch', query, city, level, skills],
    queryFn: () => searchWorkers(query, undefined, city, level, undefined, undefined, undefined, skills),
    enabled: true
  });

  return (
    <main className="min-h-screen bg-[#F5F4EF]">
      <div className="p-4 md:p-8 lg:p-12">
        {/* Bento-style Filter Section */}
        <section className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm flex flex-col justify-center relative overflow-hidden border border-[#1F3F34]/5">
            {/* Background Organic Blob */}
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#FACD15]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1F3F34]">
                  Find Reliable Workers
                </h1>
                {(query || city || level || skills) && (
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-[#1F3F34]/5 text-[#1F3F34]/60 hover:bg-[#1F3F34]/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Clear Filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Experience Level</label>
                  <div className="flex gap-2">
                    {['L1', 'L2', 'L3', 'L4'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          const newLvl = level === lvl ? '' : lvl;
                          setLevel(newLvl);
                          updateSearchParams({ level: newLvl });
                        }}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                          level === lvl 
                            ? 'bg-[#1F3F34] text-[#FACD15] shadow-lg shadow-[#1F3F34]/20' 
                            : 'bg-[#F5F4EF] text-[#1F3F34] hover:bg-[#E9E8E3]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Location / City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1F3F34]/30" />
                    <input
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        updateSearchParams({ city: e.target.value });
                      }}
                      placeholder="Search city..."
                      className="w-full bg-[#F5F4EF] border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#1F3F34] focus:ring-2 focus:ring-[#FACD15] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 ml-1">Key Skills</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1F3F34]/30" />
                    <input
                      value={skills}
                      onChange={(e) => {
                        setSkills(e.target.value);
                        updateSearchParams({ skills: e.target.value });
                      }}
                      placeholder="Electrician, Plumber..."
                      className="w-full bg-[#F5F4EF] border-none rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#1F3F34] focus:ring-2 focus:ring-[#FACD15] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3 flex flex-col justify-end">
                  <button 
                    className="w-full py-3 bg-[#FACD15] text-[#1F3F34] rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#FACD15]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                  >
                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">tune</span>
                    Refine Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-[#FACD15] rounded-[2.5rem] p-8 flex flex-col justify-between text-[#1F3F34] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-[#1F3F34]/5 w-fit px-3 py-1 rounded-full border border-[#1F3F34]/10">
                <span className="material-symbols-outlined text-sm font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Certified Base</span>
              </div>
              <h3 className="text-2xl font-black leading-tight mb-3">Trust Hire Verified</h3>
              <p className="text-sm font-bold opacity-80 leading-snug max-w-[240px]">
                Every worker on our platform is physically verified and background checked.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-8 relative z-10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#FACD15] overflow-hidden bg-[#1F3F34]/10 shadow-sm">
                    <img alt="Worker" src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full object-cover grayscale-20" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none mb-1">Active Network</span>
                <span className="text-sm font-black tracking-tight">+2.4k Professionals</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results Area */}
        <div className="space-y-8">
          <div className="flex justify-between items-end px-4">
            <div>
              <h2 className="text-2xl font-black text-[#1F3F34] tracking-tighter">
                Available Talent
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/30 mt-1">Verified search results</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/60 shadow-sm border border-[#1F3F34]/5">
                {results?.length || 0} Found
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-[#1F3F34]/5">
              <Loader2 className="h-12 w-12 text-[#FACD15] animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20 animate-pulse">Syncing Database...</p>
            </div>
          ) : results?.length === 0 ? (
            <div className="text-center py-40 bg-white border-2 border-dashed border-[#1F3F34]/10 rounded-[3.5rem] space-y-6">
              <div className="w-24 h-24 bg-[#F5F4EF] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-10 h-10 text-[#1F3F34]/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight">Zero Matches</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30 max-w-xs mx-auto">
                  We couldn't find any professionals matching your current refinement parameters.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {results?.map((worker: WorkerSearch, idx: number) => (
                <motion.div 
                  key={worker.userId} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-[#1F3F34]/5 hover:-translate-y-2 transition-all group relative border border-[#1F3F34]/5 flex flex-col overflow-hidden"
                  onClick={() => navigate(`/worker/${worker.userId}`)}
                >
                  <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                    <ShieldCheck className="h-48 w-48 text-[#1F3F34]" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="relative">
                      <div className="w-24 h-24 bg-[#F5F4EF] rounded-3xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                        {worker.profileImageUrl ? (
                          <img alt={worker.name} src={worker.profileImageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#1F3F34]/20">
                            {worker.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#1F3F34] text-[#FACD15] text-[10px] font-black px-3 py-1.5 rounded-xl border-4 border-white shadow-lg">
                        LVL {worker.level}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight group-hover:text-[#FACD15] transition-colors">{worker.name}</h3>
                      {worker.isVerified ? (
                        <div className="bg-emerald-500 text-white p-0.5 rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 shrink-0">Not Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-[#FACD15]" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">{worker.city || worker.location}</p>
                    </div>
                  </div>

                  <p className="text-[#1F3F34]/60 font-medium text-sm line-clamp-2 mb-8 h-10 leading-snug">
                    {worker.bio || "No professional executive summary available for this operative."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8 flex-1 content-start relative z-10">
                    {(worker.skills || "General Labor").split(',').slice(0, 3).map(skill => (
                      <span key={skill} className="px-4 py-2 bg-[#F5F4EF] text-[#1F3F34]/80 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-[#1F3F34]/5 group-hover:bg-[#1F3F34] group-hover:text-white transition-colors">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-[#F5F4EF] flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#FACD15]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/60">Ranked Operative</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#FACD15] text-[#1F3F34] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FACD15]/10 group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
                      Review Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
