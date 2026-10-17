import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, MapPin, X } from 'lucide-react';

interface NavbarSearchInputProps {
  className?: string;
  placeholder?: string;
}

export const NavbarSearchInput: React.FC<NavbarSearchInputProps> = ({
  className = '',
  placeholder = 'Search specialists, skills...'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const city = searchParams.get('city') || '';

  // Keep query in sync with URL
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Global ⌘K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    
    // If currently on search pages, update search params in place
    if (location.pathname === '/find-workers' || location.pathname === '/search') {
      const newParams = new URLSearchParams(searchParams);
      if (trimmed) {
        newParams.set('q', trimmed);
      } else {
        newParams.delete('q');
      }
      setSearchParams(newParams);
    } else {
      // Navigate to /find-workers with the search query
      const params = new URLSearchParams();
      if (trimmed) params.set('q', trimmed);
      if (city) params.set('city', city);
      navigate(`/find-workers?${params.toString()}`);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery('');
    if (location.pathname === '/find-workers' || location.pathname === '/search') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams);
    }
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center transition-all duration-200 ${
        isFocused 
          ? 'bg-white border-[#0f2f63]/50 shadow-md ring-2 ring-[#0f2f63]/10' 
          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
      } border rounded-full px-3 py-1.5 gap-2 ${className}`}
    >
      <Search className={`w-3.5 h-3.5 shrink-0 transition-colors ${isFocused ? 'text-[#0f2f63]' : 'text-slate-400'}`} />
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full min-w-0 flex-1 bg-transparent text-xs font-medium text-[#0A1931] placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden"
      />

      {/* Active City indicator badge */}
      {city && (
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-slate-200/80 text-[10px] font-medium text-[#0f2f63] shrink-0">
          <MapPin className="w-2.5 h-2.5 text-[#2563c9]" />
          <span className="max-w-[70px] truncate">{city}</span>
        </span>
      )}

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="p-0.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer shrink-0"
          title="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </form>
  );
};
