import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchWorkers } from '../../store/slices/searchSlice';
import { Search, MapPin, Award, ShieldCheck, Loader2, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export const WorkerSearchPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  // Removed unused query state
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [skills, setSkills] = useState(searchParams.get('skills') || '');

  const { workers, loading } = useAppSelector((state) => state.search);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const c = searchParams.get('city') || '';
    const l = searchParams.get('level') || '';
    const s = searchParams.get('skills') || '';
    
    // Removed setQuery
    setCity(c);
    setLevel(l);
    setSkills(s);

    dispatch(searchWorkers({ q, city: c, level: l, skills: s }));
  }, [searchParams, dispatch]);

  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  return (
    <main className="min-h-screen bg-[#F5F4EF] selection:bg-[#FACD15] selection:text-[#1F3F34]">
      <div className="p-4 lg:p-12 max-w-[1600px] mx-auto text-left">
        {/* Bento-style Filter Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
          <div className="md:col-span-12 lg:col-span-8 bg-white rounded-[3.5rem] p-10 lg:p-14 shadow-2xl shadow-[#1F3F34]/5 flex flex-col justify-center relative overflow-hidden border border-[#EFEEE9]">
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1F3F34] mb-12 lg:mb-16 uppercase bricolage leading-[0.9]">
                Elite<br/>
                <span className="text-[#1F3F34]/30">Operative Discovery</span>
              </h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Strategic Level</label>
                  <div className="flex flex-wrap gap-3">
                    {['L1', 'L2', 'L3', 'L4'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateSearchParams({ level: level === lvl ? '' : lvl })}
                        className={`w-12 h-12 rounded-2xl text-xs font-black transition-all border-2 ${
                          level === lvl 
                            ? 'bg-[#1F3F34] text-[#FACD15] border-[#1F3F34] shadow-xl shadow-[#1F3F34]/20' 
                            : 'bg-[#F5F4EF] text-[#1F3F34]/40 border-transparent hover:border-[#FACD15]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Deployment Hub</label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FACD15] group-focus-within:scale-125 transition-transform" />
                    <input
                      value={city}
                      onChange={(e) => updateSearchParams({ city: e.target.value.toUpperCase() })}
                      placeholder="HUB LOCATION..."
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full pl-16 pr-6 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 ml-2">Tactical Skills</label>
                  <div className="relative group">
                    <Award className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FACD15] group-focus-within:scale-125 transition-transform" />
                    <input
                      value={skills}
                      onChange={(e) => updateSearchParams({ skills: e.target.value.toUpperCase() })}
                      placeholder="WIRING, WELDING..."
                      className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full pl-16 pr-6 py-5 text-sm font-black text-[#1F3F34] focus:outline-none transition-all placeholder:text-[#1F3F34]/10 shadow-inner uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-end">
                  <button 
                    className="w-full py-5 bg-[#1F3F34] text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#1F3F34]/20 hover:bg-[#FACD15] hover:text-[#1F3F34] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                  >
                    <SlidersHorizontal className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                    RECALIBRATE
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-4 bg-[#1F3F34] rounded-[3.5rem] p-12 lg:p-14 flex flex-col justify-between text-white relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(31,63,52,0.4)]">
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
              <ShieldCheck className="w-80 h-80" />
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4 bg-white/5 w-fit px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 text-[#FACD15]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FACD15]">CERTIFIED NETWORK</span>
              </div>
              <h3 className="text-4xl font-black leading-[0.9] tracking-tighter uppercase bricolage">Trust Hire<br/>Validation</h3>
              <p className="text-sm font-bold opacity-60 leading-relaxed max-w-[280px]">
                Every operative on this matrix has passed physical validation and background screening protocols.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-12 relative z-10">
              <div className="flex -space-x-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl border-4 border-[#1F3F34] overflow-hidden bg-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all">
                    <img alt="Worker" src={`https://i.pravatar.cc/150?u=${i + 20}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-[#FACD15]">MOBILIZED ASSETS</span>
                <span className="text-2xl font-black tracking-tighter bricolage">+2.4K OPERATIVES</span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results Area */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-6 gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">
                Strategic Assets
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/20">Authorized results matrix</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="px-8 py-3 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34] shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9]">
                {workers.length} DETECTED
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-56 gap-10 bg-white/50 backdrop-blur-xl rounded-[4rem] border border-[#EFEEE9] shadow-inner">
              <Loader2 className="h-20 w-20 text-[#FACD15] animate-spin opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1F3F34]/30 animate-pulse">Synchronizing Intelligence...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-64 bg-white border-4 border-dashed border-[#EFEEE9] rounded-[4rem] space-y-10 shadow-2xl shadow-[#1F3F34]/5">
              <div className="w-32 h-32 bg-[#F5F4EF] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <Search className="w-14 h-14 text-[#1F3F34]/10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">ZERO MATCHES</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20 max-w-sm mx-auto leading-relaxed">
                  The search criteria did not yield any certified operatives in the current sector.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
              {workers.map((worker: any, idx: number) => (
                <motion.div 
                  key={worker.userId} 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white rounded-[3.5rem] p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4 transition-all duration-700 group relative border border-[#EFEEE9] flex flex-col overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/worker/${worker.userId}`)}
                >
                  <div className="absolute -right-12 -top-12 opacity-[0.02] group-hover:opacity-[0.06] group-hover:scale-125 transition-all duration-1000 pointer-events-none text-[#1F3F34]">
                    <ShieldCheck className="h-64 w-64" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="relative shrink-0">
                      <div className="w-28 h-28 bg-[#F5F4EF] rounded-[2rem] overflow-hidden shadow-inner group-hover:scale-105 group-hover:-rotate-3 transition-all duration-700 border-4 border-white ring-1 ring-[#EFEEE9] grayscale-[0.2] group-hover:grayscale-0">
                        {worker.profileImageUrl ? (
                          <img alt={worker.name} src={worker.profileImageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl font-black text-[#1F3F34]/10">
                            {worker.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-3 -right-3 bg-[#1F3F34] text-[#FACD15] text-[10px] font-black px-4 py-2 rounded-2xl border-4 border-white shadow-2xl shadow-[#1F3F34]/40">
                        LVL {worker.level}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-[#1F3F34] font-black text-3xl tracking-tighter bricolage">
                        <span className="text-[#FACD15] text-xl font-black">★</span>
                        {worker.trustScore || 30}<span className="text-[9px] opacity-20 font-black uppercase tracking-[0.3em] mt-3 ml-2">TRUST.SC</span>
                      </div>
                      <p className="text-[9px] font-black uppercase text-[#FACD15] tracking-[0.3em] mt-2">CERTIFIED ASSET</p>
                    </div>
                  </div>

                  <div className="mb-8 relative z-10">
                    <h3 className="text-3xl font-black text-[#1F3F34] tracking-tight group-hover:text-[#FACD15] transition-colors duration-500 uppercase bricolage">{worker.name}</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <MapPin className="h-4 w-4 text-[#FACD15]" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30">{worker.city || worker.location || "SECTOR UNKNOWN"}</p>
                    </div>
                  </div>

                  <p className="text-[#1F3F34]/60 font-medium text-sm line-clamp-2 mb-10 h-10 leading-snug italic">
                    "{worker.bio || "No tactical briefing available for this operative."}"
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10 flex-1 content-start relative z-10">
                    {(worker.skills || "GENERAL LABOR").split(',').slice(0, 3).map((skill: any) => (
                      <span key={skill} className="px-5 py-2.5 bg-[#F5F4EF] text-[#1F3F34]/40 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-[#EFEEE9] group-hover:bg-[#1F3F34] group-hover:text-white transition-all">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-8 border-t border-[#F5F4EF] flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-[#FACD15]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20">RANKED ASSET</span>
                    </div>
                    <button className="flex items-center gap-4 px-8 py-4 bg-[#FACD15] text-[#1F3F34] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#FACD15]/20 hover:bg-[#1F3F34] hover:text-[#FACD15] hover:-translate-y-1 active:scale-95 transition-all duration-500">
                      OPEN DOSSIER
                      <ChevronRight className="w-4 h-4 font-black" />
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
