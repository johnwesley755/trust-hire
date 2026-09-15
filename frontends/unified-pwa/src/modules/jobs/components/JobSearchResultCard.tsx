import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Loader2, ChevronRight, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';
import type { JobSearch } from '../../../services/search.service';
import type { Job } from '../../../services/job.service';

interface JobSearchResultCardProps {
  job: JobSearch | Job;
  index: number;
  applied: boolean;
  distanceKm?: number | null;
  onApply: () => void;
  isApplying: boolean;
}

export const JobSearchResultCard: React.FC<JobSearchResultCardProps> = ({
  job,
  index,
  applied,
  distanceKm,
  onApply,
  isApplying,
}) => {
  const budget = job.budget;
  const isUrgent = job.description?.toLowerCase().includes('urgent') || index === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="bg-white p-3.5 sm:p-4 rounded-xl group hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between border border-slate-200 relative overflow-hidden gap-3"
    >
      {/* Left Side: Job Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <h3 className="text-base font-bold text-[#0A1931] tracking-tight truncate group-hover:text-[#0066FF] transition-colors">
            {job.title}
          </h3>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full shrink-0 ${
            isUrgent ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {isUrgent ? 'Urgent' : 'Active'}
          </span>
          {typeof distanceKm === 'number' && !isNaN(distanceKm) && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 shrink-0">
              {distanceKm < 1 ? 'Under 1 km away' : `${distanceKm.toFixed(1)} km away`}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-slate-600 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#0066FF]" />
            <span className="truncate max-w-[130px]">{job.industry || 'General'}</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-[#0A1931]">₹{budget?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[150px]">{job.city || job.location || 'Local area'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="truncate max-w-[150px]">{(job as any).employerName || 'Verified Partner'}</span>
          </div>
        </div>
      </div>

      {/* Right Side: Action Button */}
      <div className="flex items-center gap-3 shrink-0 md:border-l md:border-slate-100 md:pl-5 self-end md:self-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
          disabled={applied || isApplying}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm ${
            applied 
            ? 'bg-emerald-100 text-emerald-700 cursor-default' 
            : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98 cursor-pointer'
          }`}
        >
          {applied ? (
            <><CheckCircle className="w-4 h-4" /> Applied</>
          ) : isApplying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>View Details <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};
