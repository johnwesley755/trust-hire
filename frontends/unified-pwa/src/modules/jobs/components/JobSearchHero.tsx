import React, { useState, useEffect } from 'react';
import { Search, MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { detectCurrentCity } from '../../../utils/geolocation';

interface JobSearchHeroProps {
  title?: string;
  subtitle?: string;
  initialQuery?: string;
  initialCity?: string;
  onSearch: (query: string, city: string) => void;
  onLocateMe?: (detectedCity?: string) => void;
  isLocating?: boolean;
}

export const JobSearchHero: React.FC<JobSearchHeroProps> = ({
  title = "Find your dream job",
  subtitle = "Discover verified jobs, high-paying roles, and trusted employers in your area.",
  initialQuery = '',
  initialCity = '',
  onSearch,
  onLocateMe,
  isLocating = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [internalLocating, setInternalLocating] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim(), city.trim());
  };

  const handleLocateClick = async () => {
    if (internalLocating || isLocating) return;
    setInternalLocating(true);
    try {
      const loc = await detectCurrentCity();
      if (loc.city) {
        setCity(loc.city);
        onSearch(query.trim(), loc.city);
        if (onLocateMe) {
          onLocateMe(loc.city);
        }
      }
    } catch (err: any) {
      console.error('Location detection error:', err);
      alert(err.message || 'Could not detect location. Please enter your city manually.');
    } finally {
      setInternalLocating(false);
    }
  };

  const isDetecting = internalLocating || isLocating;

  return (
    <div className="w-full bg-[#0A1931] text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        
        {/* Main Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-400 text-xs sm:text-sm font-medium mt-2 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Dual Search Input Box */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl shadow-black/20 flex flex-col md:flex-row items-center gap-2 border border-slate-100"
        >
          {/* Keyword / Title Input */}
          <div className="relative flex-1 w-full flex items-center px-3 py-1.5">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Search job title, keywords or company
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Electrician, Designer, Delivery..."
                className="w-full bg-transparent text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
              />
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-200 shrink-0" />

          {/* Location Input with Auto-Locate Button */}
          <div className="relative flex-1 w-full flex items-center px-3 py-1.5">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <div className="flex flex-col flex-1 text-left min-w-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Location
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City, State or Area..."
                className="w-full bg-transparent text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-normal focus:outline-none truncate"
              />
            </div>

            {/* Detect Location Button */}
            <button
              type="button"
              onClick={handleLocateClick}
              title="Detect current location"
              disabled={isDetecting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200/80 rounded-xl transition-all cursor-pointer shrink-0 text-xs font-bold disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066FF]" />
                  <span className="hidden sm:inline text-[11px]">Detecting...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span className="hidden sm:inline text-[11px]">Detect Location</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] active:scale-98 text-white rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

      </div>
    </div>
  );
};
