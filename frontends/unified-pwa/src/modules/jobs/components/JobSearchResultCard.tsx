import React from 'react';
import { Bookmark, MapPin, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
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
  const locationText = job.city || job.location || 'Local Area';
  const isVerified = job.employerProfile?.isVerified ?? true;

  // Format experience
  const expYears = job.experienceYearsRequired ?? 0;
  const experienceText = expYears === 0 
    ? '0 to 1 Year' 
    : expYears <= 2 
      ? '1 to 3 Years' 
      : `${expYears}+ Years`;

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
      className="bg-white rounded-[1.75rem] p-5 sm:p-6 border border-[#e6e8ec] hover:border-[#0f2f63]/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer space-y-4 shadow-xs relative overflow-hidden font-['Onest',system-ui,sans-serif]"
    >
      {/* Top Header: Company Monogram + Title + Bookmark */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Company Monogram Badge */}
          <div className="w-12 h-12 rounded-2xl bg-[#f4f4f4] border border-[#e6e8ec] flex items-center justify-center text-[#0a0a0a] font-semibold text-base shrink-0 group-hover:border-[#0f2f63]/30 transition-all">
            {job.employerProfile?.logoUrl ? (
              <img src={job.employerProfile.logoUrl} alt={companyName} className="w-full h-full object-contain rounded-2xl" />
            ) : (
              <span>{companyInitial}</span>
            )}
          </div>

          {/* Job Title & Company Line */}
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-base sm:text-lg font-semibold text-[#0a0a0a] group-hover:text-[#0f2f63] transition-colors truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#717784] font-medium truncate">
              <span className="text-[#0a0a0a] font-medium">{companyName}</span>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
              <span className="text-[#e6e8ec]">•</span>
              <span className="inline-flex items-center gap-1 text-[#717784] truncate">
                <MapPin className="w-3 h-3 text-[#2563c9]" />
                <span className="truncate">{locationText}</span>
              </span>
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
          className={`p-2.5 rounded-full border transition-all cursor-pointer shrink-0 ${
            isSaved 
              ? 'bg-[#0f2f63] border-[#0f2f63] text-white shadow-xs' 
              : 'bg-[#f4f4f4] border-[#e6e8ec] text-[#717784] hover:text-[#0a0a0a] hover:bg-white'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Job'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Middle Specs Grid */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3.5 bg-[#f4f4f4]/80 rounded-xl border border-[#e6e8ec]/80 text-left">
        <div>
          <span className="block text-[10px] font-medium uppercase text-[#717784]">Experience</span>
          <span className="text-xs sm:text-sm font-semibold text-[#0a0a0a]">
            {experienceText}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-medium uppercase text-[#717784]">Job Type</span>
          <span className="text-xs sm:text-sm font-semibold text-[#0a0a0a]">
            {job.jobType || 'Full-Time'}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-medium uppercase text-[#717784]">Pay / Salary</span>
          <span className="text-xs sm:text-sm font-semibold text-emerald-700">
            {salaryText}
          </span>
        </div>
      </div>

      {/* Trust & Wage Security Proof Badges */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-[11px] text-[#717784] font-medium border-t border-[#e6e8ec]/60">
        <span className="inline-flex items-center gap-1.5 text-[#0a0a0a]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Escrow Protected Wages</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#0a0a0a]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Biometric Attendance Verified</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#0a0a0a]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Direct Employer</span>
        </span>
      </div>

      {/* Footer Line: Posted Time & Apply / Status */}
      <div className="flex items-center justify-between pt-2 border-t border-[#e6e8ec] text-xs">
        <span className="text-[#717784] font-normal">
          {getPostedTime(job.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {job.hasApplied ? (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied ({job.applicationStatus || 'Under Review'})</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/job/${job.id}`);
              }}
              disabled={isApplying}
              className="rounded-full bg-[#0f2f63] hover:bg-[#2563c9] text-white text-xs font-medium uppercase px-4 py-2 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              {isApplying ? (
                <AppLoader variant="inline" size="sm" />
              ) : (
                <>
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
