import React from 'react';
import { Bookmark, Building2, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLoader } from '../../../components/common/AppLoader';
import { useSavedStore } from '../../../hooks/useSavedStore';

export interface JobCardData {
  id: string;
  title: string;
  description?: string;
  industry?: string;
  jobType?: string;
  location?: string;
  city?: string;
  budget?: number;
  experienceYearsRequired?: number;
  status?: string;
  createdAt?: string;
  employerProfile?: {
    id?: string;
    companyName?: string;
    isVerified?: boolean;
    city?: string;
    logoUrl?: string;
  } | null;
  hasApplied?: boolean;
  applicationStatus?: string;
}

interface JobSearchResultCardProps {
  job: JobCardData;
  onApply?: (jobId: string) => void;
  isApplying?: boolean;
}

export const JobSearchResultCard: React.FC<JobSearchResultCardProps> = ({
  job,
  onApply,
  isApplying = false,
}) => {
  const navigate = useNavigate();
  const { isJobSaved, toggleSaveJob } = useSavedStore();
  const isSaved = isJobSaved(job.id);

  const companyName = job.employerProfile?.companyName || 'Verified Employer';
  const locationText = job.city || job.location || 'Remote / Multiple Locations';
  const isVerified = job.employerProfile?.isVerified ?? true;

  // Format experience
  const expYears = job.experienceYearsRequired ?? 0;
  const experienceText = expYears === 0 
    ? '0 to 1 Year' 
    : expYears <= 2 
      ? '1 to 3 Years' 
      : `${expYears} to ${expYears + 2} Years`;

  // Format salary
  const budget = job.budget ?? 0;
  const salaryText = budget > 0 
    ? (budget > 10000 
        ? `₹${(budget / 1000).toFixed(0)}k - ₹${((budget * 1.3) / 1000).toFixed(0)}k / mo` 
        : `₹${budget.toLocaleString()} / day`)
    : 'Competitive Pay';

  // Format posted time
  const getPostedTime = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diffHours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Posted just now';
    if (diffHours < 24) return `Posted ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Posted ${diffDays}d ago`;
  };

  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <div 
      onClick={() => navigate(`/job/${job.id}`)}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#0066FF]/60 hover:shadow-lg transition-all duration-200 group cursor-pointer space-y-4"
    >
      {/* Top Header: Company Avatar + Title + Bookmark */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Company Monogram Badge */}
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-base shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-[#0066FF] transition-all">
            {job.employerProfile?.logoUrl ? (
              <img src={job.employerProfile.logoUrl} alt={companyName} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <span>{companyInitial}</span>
            )}
          </div>

          {/* Job Title & Company Line */}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate font-['Outfit',sans-serif]">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5 truncate">
              <span className="text-slate-800 font-semibold">{companyName}</span>
              {isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              <span>•</span>
              <span className="truncate">{locationText}</span>
            </div>
          </div>
        </div>

        {/* Save Job Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveJob({
              id: job.id,
              title: job.title,
              companyName,
              logoUrl: job.employerProfile?.logoUrl,
              location: locationText,
              city: job.city,
              budget: job.budget,
              salaryText,
              jobType: job.jobType,
              experienceText,
              experienceYearsRequired: job.experienceYearsRequired,
            });
          }}
          className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
            isSaved 
              ? 'bg-blue-50 border-blue-200 text-[#0066FF]' 
              : 'bg-slate-50 border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Job'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Middle Specs Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/70 rounded-xl border border-slate-100 text-left">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">
            {experienceText}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Type</span>
          <span className="text-xs sm:text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">
            {job.jobType || 'Full-Time'}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary / Pay</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-600 font-['Outfit',sans-serif]">
            {salaryText}
          </span>
        </div>
      </div>

      {/* Footer Line: Posted Time & Apply / Status */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-slate-400 font-medium">
          {getPostedTime(job.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {job.hasApplied ? (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied ({job.applicationStatus || 'Under Review'})
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/job/${job.id}`);
              }}
              disabled={isApplying}
              className="px-4 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] active:scale-98 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer font-['Outfit',sans-serif]"
            >
              {isApplying ? (
                <AppLoader variant="inline" size="sm" />
              ) : (
                <>
                  <span>Apply Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
