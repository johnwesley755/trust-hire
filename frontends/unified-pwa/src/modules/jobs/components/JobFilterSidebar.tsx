import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

export interface FilterCounts {
  jobTypes: Record<string, number>;
  locations: Record<string, number>;
  trades: Record<string, number>;
  total: number;
}

interface JobFilterSidebarProps {
  selectedJobType: string;
  onSelectJobType: (type: string) => void;
  
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  
  selectedBudget: string;
  onSelectBudget: (budget: string) => void;

  selectedTrade: string;
  onSelectTrade: (trade: string) => void;

  selectedExperience: string;
  onSelectExperience: (exp: string) => void;

  counts?: FilterCounts;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export const JOB_TYPE_OPTIONS = [
  'All',
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
  'Freelance',
  'Daily Gig'
];

export const BUDGET_RANGE_OPTIONS = [
  { label: 'All Pay Ranges', value: 'all' },
  { label: 'Under ₹1,000 / day', value: 'under1000' },
  { label: '₹1,000 - ₹2,500 / day', value: '1000to2500' },
  { label: '₹2,500 - ₹5,000 / day', value: '2500to5000' },
  { label: '₹5,000+ / day', value: 'above5000' }
];

export const EXPERIENCE_OPTIONS = [
  { label: 'All Experience', value: 'all' },
  { label: '0 to 1 Year (Entry)', value: '0-1' },
  { label: '1 to 3 Years (Junior)', value: '1-3' },
  { label: '3 to 5 Years (Mid)', value: '3-5' },
  { label: '5+ Years (Senior)', value: '5+' }
];

export const TRADE_CATEGORIES = [
  'All',
  'Construction',
  'Facility Management',
  'Logistics',
  'Manufacturing',
  'Security',
  'Hospitality',
  'Retail',
  'Agriculture'
];

export const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({
  selectedJobType,
  onSelectJobType,
  selectedLocation,
  onSelectLocation,
  selectedBudget,
  onSelectBudget,
  selectedTrade,
  onSelectTrade,
  selectedExperience,
  onSelectExperience,
  counts,
  onClearAll,
  hasActiveFilters,
}) => {
  return (
    <aside className="w-full space-y-6 font-sans">
      
      {/* Filters Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0066FF]" />
          <h2 className="text-base font-extrabold text-[#0A1931] font-['Outfit',sans-serif]">
            Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* 1. JOB TYPE SECTION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            JOB TYPE
          </span>
          {selectedJobType !== 'All' && (
            <button
              onClick={() => onSelectJobType('All')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {JOB_TYPE_OPTIONS.map((type) => {
            const isSelected = selectedJobType === type;
            const count = counts?.jobTypes?.[type] ?? (type === 'All' ? counts?.total : undefined);

            return (
              <button
                key={type}
                onClick={() => onSelectJobType(type)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'text-[#0066FF] font-bold bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{type}</span>
                {count !== undefined && (
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-[#0066FF] font-bold' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LOCATION SECTION */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            LOCATION
          </span>
          {selectedLocation && (
            <button
              onClick={() => onSelectLocation('')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onSelectLocation('')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
              !selectedLocation
                ? 'text-[#0066FF] font-bold bg-blue-50/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <span>All Locations</span>
            {counts?.total !== undefined && (
              <span className={`text-[11px] font-medium ${!selectedLocation ? 'text-[#0066FF] font-bold' : 'text-slate-400'}`}>
                ({counts.total})
              </span>
            )}
          </button>
          {counts?.locations && Object.entries(counts.locations).slice(0, 5).map(([city, count]) => {
            const isSelected = selectedLocation.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                onClick={() => onSelectLocation(city)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'text-[#0066FF] font-bold bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{city}</span>
                <span className={`text-[11px] font-medium ${isSelected ? 'text-[#0066FF] font-bold' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. EXPERIENCE SECTION */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            EXPERIENCE
          </span>
          {selectedExperience !== 'all' && (
            <button
              onClick={() => onSelectExperience('all')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {EXPERIENCE_OPTIONS.map((opt) => {
            const isSelected = selectedExperience === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelectExperience(opt.value)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'text-[#0066FF] font-bold bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. PAY / SALARY SECTION */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            SALARY / PAY
          </span>
          {selectedBudget !== 'all' && (
            <button
              onClick={() => onSelectBudget('all')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {BUDGET_RANGE_OPTIONS.map((opt) => {
            const isSelected = selectedBudget === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelectBudget(opt.value)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'text-[#0066FF] font-bold bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. INDUSTRY / TRADE SECTION */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            INDUSTRY / TRADE
          </span>
          {selectedTrade !== 'All' && (
            <button
              onClick={() => onSelectTrade('All')}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {TRADE_CATEGORIES.map((trade) => {
            const isSelected = selectedTrade === trade;
            return (
              <button
                key={trade}
                onClick={() => onSelectTrade(trade)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'text-[#0066FF] font-bold bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{trade}</span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
};
