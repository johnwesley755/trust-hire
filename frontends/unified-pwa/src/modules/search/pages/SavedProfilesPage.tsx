import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSavedStore } from '../../../hooks/useSavedStore';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { DataTablePagination } from '../../../components/common/DataTablePagination';
import { 
  Bookmark, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Users, 
  Trash2, 
  Search,
  ExternalLink
} from 'lucide-react';

export const SavedProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedWorkers, removeSavedWorker } = useSavedStore();

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter workers based on query
  const filteredWorkers = useMemo(() => {
    if (!searchQuery.trim()) return savedWorkers;
    const q = searchQuery.toLowerCase();
    return savedWorkers.filter(w => 
      w.name.toLowerCase().includes(q) ||
      (w.city && w.city.toLowerCase().includes(q)) ||
      (w.location && w.location.toLowerCase().includes(q)) ||
      (w.skills && w.skills.some(s => s.toLowerCase().includes(q)))
    );
  }, [savedWorkers, searchQuery]);

  // Compute pagination
  const totalItems = filteredWorkers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Keep current page in bounds
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedWorkers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredWorkers.slice(startIndex, startIndex + pageSize);
  }, [filteredWorkers, safeCurrentPage, pageSize]);

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
                <span>Shortlisted Candidates</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight font-['Outfit',sans-serif]">
                Saved Profiles
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Review and manage your bookmarked specialists for direct hiring and job offers.
              </p>
            </div>

            <Link
              to="/find-workers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif] self-start sm:self-auto"
            >
              <Users className="w-4 h-4" />
              <span>Browse Workers</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        {savedWorkers.length > 0 ? (
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
                  placeholder="Filter by candidate name, skill, or city..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 px-1">
                <span>
                  {filteredWorkers.length}{' '}
                  {filteredWorkers.length === 1 ? 'specialist' : 'specialists'}{' '}
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
                      <th className="px-5 py-4">Candidate</th>
                      <th className="px-5 py-4">Role & Experience</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Key Skills</th>
                      {/* TrustScore - Temporarily hidden until TrustScore engine is fully implemented */}
                      {/* <th className="px-5 py-4">Trust Score</th> */}
                      <th className="px-5 py-4">Saved Date</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedWorkers.length > 0 ? (
                      paginatedWorkers.map((worker) => (
                        <tr
                          key={worker.userId}
                          className="hover:bg-blue-50/40 transition-colors group"
                        >
                          {/* Candidate Avatar & Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                src={worker.profileImageUrl || worker.profilePhoto}
                                name={worker.name}
                                size="md"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => navigate(`/worker/${worker.userId}`)}
                                    className="font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate hover:underline text-left cursor-pointer"
                                  >
                                    {worker.name}
                                  </button>
                                  {worker.isVerified && (
                                    <span title="ID Verified" className="inline-flex shrink-0">
                                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 font-mono block">
                                  ID: {worker.userId.slice(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Role & Experience */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <span className="font-semibold text-slate-800 text-xs block">
                                {worker.skills?.[0] || 'Technician'}
                              </span>
                              <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#0066FF] rounded-md font-bold text-[10px]">
                                {worker.experience ? `${worker.experience}+ Yrs Exp` : 'Verified'}
                              </span>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                              <span className="truncate max-w-[140px]">
                                {worker.city || worker.location || 'Local Area'}
                              </span>
                            </div>
                          </td>

                          {/* Skills */}
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {worker.skills && worker.skills.length > 0 ? (
                                <>
                                  {worker.skills.slice(0, 3).map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md whitespace-nowrap"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {worker.skills.length > 3 && (
                                    <span className="text-slate-400 text-[10px] font-bold self-center">
                                      +{worker.skills.length - 3}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">General</span>
                              )}
                            </div>
                          </td>

                          {/* Trust Rating - Temporarily hidden until TrustScore engine is fully implemented */}
                          {/*
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-extrabold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{worker.trustScore ? `${worker.trustScore}%` : '98%'}</span>
                            </div>
                          </td>
                          */}

                          {/* Saved Date */}
                          <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium">
                            {new Date(worker.savedAt).toLocaleDateString()}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/worker/${worker.userId}`)}
                                className="px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer font-['Outfit',sans-serif]"
                              >
                                <span>View Profile</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => removeSavedWorker(worker.userId)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove from Saved"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          <p className="font-semibold text-sm">No specialists match your filter criteria.</p>
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
                itemName="saved profiles"
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
              No Saved Profiles Yet
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              When browsing specialists and candidates, tap the bookmark icon to save profiles here for quick access and direct hiring.
            </p>
            <div className="pt-2">
              <Link
                to="/find-workers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Find Candidates Now</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
