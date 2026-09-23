import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSavedStore } from '../../../hooks/useSavedStore';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { 
  Bookmark, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Users, 
  Trash2, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SavedProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedWorkers, removeSavedWorker } = useSavedStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
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
                Review and manage your bookmarked specialists for direct hiring and shift offers.
              </p>
            </div>

            <Link
              to="/find-workers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 transition-all cursor-pointer font-['Outfit',sans-serif]"
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
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>{savedWorkers.length} {savedWorkers.length === 1 ? 'specialist saved' : 'specialists saved'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence>
                {savedWorkers.map((worker) => (
                  <motion.div
                    key={worker.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => navigate(`/worker/${worker.userId}`)}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#0066FF]/60 hover:shadow-lg transition-all duration-200 group cursor-pointer space-y-4 relative"
                  >
                    {/* Top Row: Avatar + Details + Remove */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <UserAvatar
                          src={worker.profileImageUrl || worker.profilePhoto}
                          name={worker.name}
                          size="lg"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate font-['Outfit',sans-serif]">
                              {worker.name}
                            </h3>
                            {worker.isVerified && (
                              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                            <span className="flex items-center gap-1 text-slate-700 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                              {worker.city || worker.location || 'Local Area'}
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-[#0066FF] rounded-md font-bold text-[10px]">
                              {worker.experience ? `${worker.experience}+ Yrs Exp` : 'Verified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedWorker(worker.userId);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                        title="Remove from Saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bio Preview */}
                    {worker.bio && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {worker.bio}
                      </p>
                    )}

                    {/* Skills Badges */}
                    {worker.skills && worker.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {worker.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 4 && (
                          <span className="px-2 py-1 text-slate-400 text-[10px] font-bold">
                            +{worker.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Saved {new Date(worker.savedAt).toLocaleDateString()}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/worker/${worker.userId}`);
                        }}
                        className="px-3.5 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer font-['Outfit',sans-serif]"
                      >
                        <span>View & Send Offer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
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
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
