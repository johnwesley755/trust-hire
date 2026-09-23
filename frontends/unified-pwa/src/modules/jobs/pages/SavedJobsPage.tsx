import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSavedStore } from '../../../hooks/useSavedStore';
import { 
  Bookmark, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  Briefcase,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedJobs, removeSavedJob } = useSavedStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-1">
                <Bookmark className="w-4 h-4 fill-current" />
                <span>My Bookmarks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight font-['Outfit',sans-serif]">
                Saved Jobs
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Review opportunities you have bookmarked and submit your applications.
              </p>
            </div>

            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse All Jobs</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>{savedJobs.length} {savedJobs.length === 1 ? 'job saved' : 'jobs saved'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence>
                {savedJobs.map((job) => {
                  const companyName = job.companyName || 'Verified Employer';
                  const companyInitial = companyName.charAt(0).toUpperCase();
                  const locationText = job.city || job.location || 'Remote / Local Area';

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#0066FF]/60 hover:shadow-lg transition-all duration-200 group cursor-pointer space-y-4 relative"
                    >
                      {/* Top Row: Company Avatar + Title + Remove */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Company Logo Badge */}
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-base shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-[#0066FF] transition-all">
                            {job.logoUrl ? (
                              <img src={job.logoUrl} alt={companyName} className="w-full h-full object-contain rounded-xl" />
                            ) : (
                              <span>{companyInitial}</span>
                            )}
                          </div>

                          {/* Title & Company */}
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate font-['Outfit',sans-serif]">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5 truncate">
                              <span className="text-slate-800 font-semibold">{companyName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>•</span>
                              <span className="truncate">{locationText}</span>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSavedJob(job.id);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                          title="Remove from Saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Middle Specs Grid */}
                      <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/70 rounded-xl border border-slate-100 text-left">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</span>
                          <span className="text-xs font-bold text-slate-900 font-['Outfit',sans-serif]">
                            {job.experienceText || `${job.experienceYearsRequired || 0}+ Yrs`}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Type</span>
                          <span className="text-xs font-bold text-slate-900 font-['Outfit',sans-serif]">
                            {job.jobType || 'Full-Time'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary / Pay</span>
                          <span className="text-xs font-bold text-emerald-600 font-['Outfit',sans-serif] truncate block">
                            {job.salaryText || (job.budget ? `₹${job.budget.toLocaleString()}` : 'Competitive')}
                          </span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Saved {new Date(job.savedAt).toLocaleDateString()}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/jobs/${job.id}`);
                          }}
                          className="px-4 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer font-['Outfit',sans-serif]"
                        >
                          <span>View & Apply</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
              <Bookmark className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0A1931] font-['Outfit',sans-serif]">
              No Saved Jobs Yet
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              When searching for shifts and trade roles, tap the bookmark icon on any job card to save it here for easy review and fast applications.
            </p>
            <div className="pt-2">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Explore Jobs Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
