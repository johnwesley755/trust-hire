import React from 'react';
import { Search, MapPin, ChevronRight, Zap, ShieldCheck, LocateFixed, Loader2 } from 'lucide-react';

interface JobSearchHeroProps {
  query: string;
  city: string;
  totalJobs?: number;
  isLocating?: boolean;
  onQueryChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onDetectLocation?: () => void;
  onSearch: () => void;
}

export const JobSearchHero: React.FC<JobSearchHeroProps> = ({
  query,
  city,
  totalJobs,
  isLocating,
  onQueryChange,
  onCityChange,
  onDetectLocation,
  onSearch,
}) => {
  return (
    <section className="px-4 sm:px-6 pt-4 pb-6 relative overflow-hidden bg-gradient-to-b from-[#0066FF]/10 via-[#0066FF]/5 to-transparent rounded-b-3xl border-b border-blue-100/60">
      {/* Decorative Gradient Orbs */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-10 w-60 h-60 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <nav className="flex items-center gap-1.5 mb-2 text-xs font-bold text-[#0066FF]">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> TrustHyre</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700">Hyper-Local Job Portal</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight leading-tight">
              Instant Shifts & Verified Jobs Near You
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Guaranteed escrow payouts • 1-Click Instant Apply • No interview delays
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{typeof totalJobs === 'number' ? `${totalJobs} Live Openings` : 'Live Openings'}</span>
          </div>
        </div>

        {/* Hyper-local Search Bar */}
        <div className="bg-white p-1.5 sm:p-2 rounded-2xl shadow-md shadow-blue-900/5 flex flex-col md:flex-row gap-2 border border-blue-100">
          <div className="flex-grow flex items-center gap-2.5 px-3.5 bg-slate-50 rounded-xl group focus-within:bg-white focus-within:ring-2 ring-[#0066FF] transition-all">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#0066FF] shrink-0" />
            <input 
              type="text" 
              placeholder="Search trade (e.g. Electrician, Plumber, Driver, Warehouse)..." 
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="md:w-72 flex items-center gap-2 px-3 bg-slate-50 rounded-xl group focus-within:bg-white focus-within:ring-2 ring-[#0066FF] transition-all">
            <MapPin className="w-4 h-4 text-[#0066FF] shrink-0" />
            <input 
              type="text" 
              placeholder="Area / City (e.g. Koramangala)..." 
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none w-full py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400"
            />
            {onDetectLocation && (
              <button
                type="button"
                onClick={onDetectLocation}
                disabled={isLocating}
                title="Detect my current location"
                className="p-1.5 hover:bg-blue-100 text-[#0066FF] rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
              </button>
            )}
          </div>

          <button 
            onClick={onSearch}
            className="bg-[#0066FF] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            Find Shifts
          </button>
        </div>

        {/* Category quick filters */}
        <div className="flex gap-1.5 mt-2.5 flex-wrap items-center">
          <span className="text-xs font-semibold text-slate-400 mr-1">Popular trades:</span>
          {['Electrician', 'Plumbing', 'Delivery Driver', 'Warehouse', 'Welder', 'Carpenter', 'Facility'].map(industry => (
            <button
              key={industry} 
              onClick={() => onQueryChange(industry)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-600 hover:text-[#0066FF] rounded-full text-xs font-medium border border-slate-200 hover:border-blue-200 shadow-xs transition-all cursor-pointer"
            >
              {industry}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
