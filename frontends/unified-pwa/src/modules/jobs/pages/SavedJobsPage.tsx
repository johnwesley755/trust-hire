import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSavedStore } from '../../../hooks/useSavedStore';
import { DataTablePagination } from '../../../components/common/DataTablePagination';
import { 
  Bookmark, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Trash2, 
  Briefcase,
  Search,
  IndianRupee
} from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedJobs, removeSavedJob } = useSavedStore();

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter jobs based on query
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return savedJobs;
    const q = searchQuery.toLowerCase();
    return savedJobs.filter(j => 
      j.title.toLowerCase().includes(q) ||
      (j.companyName && j.companyName.toLowerCase().includes(q)) ||
      (j.city && j.city.toLowerCase().includes(q)) ||
      (j.location && j.location.toLowerCase().includes(q)) ||
      (j.jobType && j.jobType.toLowerCase().includes(q))
    );
  }, [savedJobs, searchQuery]);

  // Compute pagination
  const totalItems = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredJobs.slice(startIndex, startIndex + pageSize);
  }, [filteredJobs, safeCurrentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif] self-start sm:self-auto"
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
            {/* Control Bar: Search and Summary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by job title, company, or city..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 px-1">
                <span>
                  {filteredJobs.length}{' '}
                  {filteredJobs.length === 1 ? 'job' : 'jobs'}{' '}
                  {searchQuery ? 'matching' : 'saved'}
                </span>
              </div>
            </div>

            {/* Table View Container */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="px-5 py-4">Job & Company</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Job Type</th>
                      <th className="px-5 py-4">Compensation</th>
                      <th className="px-5 py-4">Experience</th>
                      <th className="px-5 py-4">Saved Date</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedJobs.length > 0 ? (
                      paginatedJobs.map((job) => {
                        const companyName = job.companyName || 'Verified Employer';
                        const companyInitial = companyName.charAt(0).toUpperCase();
                        const locationText = job.city || job.location || 'Local Area';

                        return (
                          <tr
                            key={job.id}
                            className="hover:bg-blue-50/40 transition-colors group"
                          >
                            {/* Job & Company */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-sm shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-[#0066FF] transition-all overflow-hidden">
                                  {job.logoUrl ? (
                                    <img
                                      src={job.logoUrl}
                                      alt={companyName}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <span>{companyInitial}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <button
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                    className="font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate hover:underline text-left cursor-pointer block max-w-xs"
                                  >
                                    {job.title}
                                  </button>
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                                    <span className="text-slate-800 font-semibold truncate">
                                      {companyName}
                                    </span>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                <span className="truncate max-w-[140px]">{locationText}</span>
                              </div>
                            </td>

                            {/* Job Type */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                {job.jobType || 'Full-Time'}
                              </span>
                            </td>

                            {/* Compensation */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="font-extrabold text-emerald-600 text-xs">
                                {job.salaryText || (job.budget ? `₹${job.budget.toLocaleString()}` : 'Competitive')}
                              </span>
                            </td>

                            {/* Experience */}
                            <td className="px-5 py-4 whitespace-nowrap text-slate-700 font-medium">
                              {job.experienceText || `${job.experienceYearsRequired || 0}+ Yrs`}
                            </td>

                            {/* Saved Date */}
                            <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium">
                              {new Date(job.savedAt).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer font-['Outfit',sans-serif]"
                                >
                                  <span>View & Apply</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeSavedJob(job.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Remove from Saved"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          <p className="font-semibold text-sm">No jobs match your filter criteria.</p>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-xs font-bold text-[#0066FF] hover:underline"
                          >
                            Clear search filter
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer: Standardized Pagination */}
              <DataTablePagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20, 50]}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                itemName="saved jobs"
              />
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
              When searching jobs, bookmark opportunities you are interested in to review and apply to them later.
            </p>
            <div className="pt-2">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Find Jobs Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
