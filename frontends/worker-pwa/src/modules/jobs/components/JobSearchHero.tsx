import React from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';

interface JobSearchHeroProps {
  query: string;
  city: string;
  onQueryChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onSearch: () => void;
}

export const JobSearchHero: React.FC<JobSearchHeroProps> = ({
  query,
  city,
  onQueryChange,
  onCityChange,
  onSearch,
}) => {
  return (
    <section className="px-8 pt-10 pb-16 relative overflow-hidden bg-[#f5f4ef] rounded-b-[3rem]">
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#ffe081] opacity-10 organic-blob pointer-events-none"></div>
      <div className="absolute bottom-0 -left-10 w-60 h-60 bg-[#c7ebdb] opacity-5 organic-blob pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 px-4 md:px-0">
        <nav className="flex items-center gap-2 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#414845]/60">
          <span>TrustHire</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1b1c19]">Market Intelligence</span>
        </nav>
        
        <h1 className="text-3xl md:text-6xl font-black text-[#2d2300] mb-8 tracking-tighter leading-none text-balance">
          Opportunity Hub
        </h1>

        {/* Bento-style Search Bar */}
        <div className="bg-white p-3 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] flex flex-col md:flex-row gap-2 border border-[#1F3F34]/5">
          <div className="flex-grow flex items-center gap-3 px-6 bg-[#f5f4ef] rounded-2xl group focus-within:ring-2 ring-[#FACD15] transition-all">
            <Search className="w-5 h-5 text-[#727975] group-focus-within:text-[#1F3F34]" />
            <input 
              type="text" 
              placeholder="Search roles or expertise..." 
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full py-5 text-sm font-bold text-[#1b1c19] placeholder-[#727975]/50"
            />
          </div>
          <div className="md:w-72 flex items-center gap-3 px-6 bg-[#f5f4ef] rounded-2xl group focus-within:ring-2 ring-[#FACD15] transition-all">
            <MapPin className="w-5 h-5 text-[#727975] group-focus-within:text-[#1F3F34]" />
            <input 
              type="text" 
              placeholder="Location..." 
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full py-5 text-sm font-bold text-[#1b1c19] placeholder-[#727975]/50"
            />
          </div>
          <button 
            onClick={onSearch}
            className="bg-[#FACD15] text-[#1F3F34] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FACD15]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Find Jobs
          </button>
        </div>

        <div className="flex gap-3 mt-8 flex-wrap">
          <span className="px-5 py-2.5 bg-[#c7ebdb] text-[#4a6b5e] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 
            1,240 New Roles Today
          </span>
          {['Cooking / Chef', 'Construction', 'Logistics', 'Retail', 'Security', 'Agriculture', 'Domestic Help'].map(industry => (
            <span key={industry} className="px-5 py-2.5 bg-white text-[#414845]/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#1F3F34]/5 shadow-sm hover:border-[#FACD15] transition-all cursor-pointer">
              {industry}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .organic-blob {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
      `}</style>
    </section>
  );
};
