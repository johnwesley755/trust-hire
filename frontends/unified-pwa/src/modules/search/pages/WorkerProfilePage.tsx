import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerService } from '../../../services/worker.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { queryKeys } from '../../../lib/queryKeys';
import { 
  ShieldCheck, 
  ChevronLeft, 
  Loader2, 
  Share2, 
  Bookmark, 
  BadgeCheck, 
  Zap, 
  MapPin,
  Mail,
  Phone,
  Briefcase,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { AppLoader } from '../../../components/common/AppLoader';

export const WorkerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: employerStatusData } = useQuery({
    queryKey: queryKeys.employer.workerStatus(id || ''),
    queryFn: () => applicationService.getEmployerWorkerStatus(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const existingApplications = employerStatusData?.applications || [];
  const applicationsByJobId = new Map(existingApplications.map((app: any) => [app.jobId, app]));

  const { data: myJobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: queryKeys.jobs.employerJobs,
    queryFn: () => jobService.getMyJobs(),
    enabled: isModalOpen,
    staleTime: 1000 * 60 * 3,
  });

  const dispatchOfferMutation = useMutation({
    mutationFn: (jobId: string) => applicationService.dispatchOffer({ jobId, workerId: id || '' }),
    onSuccess: () => {
      setErrorMessage(null);
      setIsModalOpen(false);
      setSelectedJobId('');
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.employer.workerStatus(id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.workers.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
    onError: (err: any) => {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to dispatch offer.');
    }
  });

  const handleDispatchOffer = () => {
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleConfirmOffer = () => {
    if (selectedJobId) {
      dispatchOfferMutation.mutate(selectedJobId);
    }
  };

  useEffect(() => {
    if (id) {
      workerService.incrementProfileView(id).catch(() => {});
    }
  }, [id]);

  const { data: worker, isLoading: isLoadingWorker } = useQuery({
    queryKey: queryKeys.workers.detail(id || ''),
    queryFn: () => workerService.getWorkerById(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const { data: ratings } = useQuery({
    queryKey: queryKeys.workers.ratings(id || ''),
    queryFn: () => workerService.getWorkerRatings(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoadingWorker) return <AppLoader variant="page" message="Loading Profile..." />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 space-y-6">
        
        {/* Header Actions */}
        <header className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0A1931] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Worker Search</span>
          </button>
          
          <div className="flex gap-3">
            <button className="p-2 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-slate-500 cursor-pointer">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top Banner */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066FF] to-[#0A1931]"></div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 w-full md:w-auto text-center sm:text-left">
                <div className="shrink-0">
                  <UserAvatar 
                    src={worker?.profilePhoto} 
                    name={worker?.name || 'Worker'} 
                    size="xl" 
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">{worker?.name || 'Worker Name'}</h1>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                    <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {worker?.skills?.[0] || 'Specialist'}
                    </span>
                    <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {worker?.city || worker?.location || 'Location Not Set'}
                    </span>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                      worker?.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <ShieldCheck className="w-4 h-4" /> 
                      {worker?.verificationStatus === 'VERIFIED' ? 'Verified Worker' : 'Unverified Worker'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${worker?.availability === 'AVAILABLE' ? 'bg-[#0066FF]/10 text-[#0066FF]' : 'bg-slate-100 text-slate-600'}`}>
                      {worker?.availability === 'AVAILABLE' ? 'Available to Work' : 'Currently Busy'}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-700">
                      {worker?.experience || 0} Years Exp.
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto sm:mt-0 mt-4">
                 {(() => {
                   const hasApproved = existingApplications.some((a: any) => a.status === 'ACCEPTED' || a.status === 'APPROVED');
                   const hasOfferSent = existingApplications.some((a: any) => a.status === 'OFFER_SENT');
                   const hasDeclined = existingApplications.length > 0 && existingApplications.every((a: any) => a.status === 'REJECTED' || a.status === 'DECLINED');

                   return (
                     <button 
                       onClick={handleDispatchOffer}
                       className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer ${
                         hasApproved
                           ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                           : hasOfferSent
                           ? 'bg-amber-500 hover:bg-amber-600 text-white'
                           : hasDeclined
                           ? 'bg-rose-500 hover:bg-rose-600 text-white'
                           : 'bg-[#0066FF] hover:bg-[#0052cc] text-white'
                       }`}
                     >
                       {hasApproved 
                         ? 'Approved for Job' 
                         : hasOfferSent 
                         ? 'Offer Sent' 
                         : hasDeclined 
                         ? 'Offer Declined' 
                         : 'Dispatch Offer'}
                     </button>
                   );
                 })()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Professional Bio */}
                {worker?.bio && (
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-[#0A1931] mb-4">Professional Bio</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {worker.bio}
                    </p>
                  </div>
                )}

                {/* Verified Skills Section */}
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-[#0A1931] mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#0066FF]" /> Verified Expertise
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {worker?.skills && worker.skills.length > 0 ? (
                      worker.skills.map((skill, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                          <span className="font-bold text-[#0A1931]">{skill.trim()}</span>
                          <BadgeCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic text-sm">No specialized skills listed.</p>
                    )}
                  </div>
                </div>

                {/* Reviews & Ratings Section */}
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-[#0A1931] mb-6">Ratings & Verifications</h3>
                  
                  {ratings && ratings.length > 0 ? (
                    <div className="space-y-4">
                      {ratings.map((review: any) => (
                        <div key={review.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-[#0A1931]">{review.reviewerName || 'Employer Partner'}</span>
                            <span className="text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                              ★ {review.score} / 5
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              "{review.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-slate-400 font-medium text-xs">No customer reviews yet. Background check and skill verifications passed.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Contact & Direct Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-[#0A1931]">Contact & Verification</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-[#0066FF] rounded-xl">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Email Address</span>
                        <span className="text-xs font-bold text-slate-700 truncate block">
                          {worker?.email || 'Registered Worker Email'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Phone Number</span>
                        <span className="text-xs font-bold text-slate-700 block">
                          {worker?.phoneNumber || 'Contact via Direct Dispatch'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Primary Location</span>
                        <span className="text-xs font-bold text-slate-700 block truncate">
                          {worker?.address || worker?.city || worker?.location || 'Location on file'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dispatch Offer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-[#0A1931]">Dispatch Job Offer</h2>
                  <p className="text-xs text-slate-400 font-medium">Select an open shift to send to {worker?.name || 'this candidate'}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {errorMessage && (
                  <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
                  Your Active Job Openings:
                </p>
                
                {isLoadingJobs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
                  </div>
                ) : myJobs && myJobs.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {myJobs.map((job: any) => {
                      const appForJob = applicationsByJobId.get(job.id);
                      const isOfferSentForJob = appForJob?.status === 'OFFER_SENT';
                      const isApprovedForJob = appForJob?.status === 'ACCEPTED' || appForJob?.status === 'APPROVED';
                      const isDeclinedForJob = appForJob?.status === 'REJECTED' || appForJob?.status === 'DECLINED';
                      const isPendingForJob = appForJob?.status === 'PENDING';
                      const isBlocked = isOfferSentForJob || isApprovedForJob || isDeclinedForJob;

                      return (
                        <label 
                          key={job.id}
                          className={`flex items-start p-4 rounded-xl border-2 transition-all ${
                            isBlocked
                              ? 'border-slate-100 bg-slate-50/70 opacity-70 cursor-not-allowed'
                              : selectedJobId === job.id 
                              ? 'border-[#0066FF] bg-blue-50/50 cursor-pointer' 
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="jobSelection" 
                            className="mt-1 sr-only"
                            disabled={isBlocked}
                            checked={selectedJobId === job.id}
                            onChange={() => !isBlocked && setSelectedJobId(job.id)}
                          />
                          <div className="flex-1 ml-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`font-bold text-sm ${selectedJobId === job.id ? 'text-[#0066FF]' : 'text-[#0A1931]'}`}>
                                {job.title}
                              </h4>
                              {isApprovedForJob && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Approved
                                </span>
                              )}
                              {isOfferSentForJob && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Offer Sent
                                </span>
                              )}
                              {isDeclinedForJob && (
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Declined
                                </span>
                              )}
                              {isPendingForJob && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Applied
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              {job.location || job.city || 'Location on file'} • ₹{job.budget?.toLocaleString() || '0'}
                            </p>
                            {isBlocked && (
                              <p className="text-[11px] font-bold mt-1 text-slate-400">
                                {isApprovedForJob 
                                  ? 'Candidate is already hired for this position.' 
                                  : isOfferSentForJob 
                                  ? 'An offer has already been dispatched for this position.' 
                                  : 'Offer for this position was previously declined.'}
                              </p>
                            )}
                          </div>
                          {!isBlocked && (
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                              selectedJobId === job.id ? 'border-[#0066FF]' : 'border-slate-300'
                            }`}>
                              {selectedJobId === job.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />}
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500 font-medium text-xs">You don't have any active job openings to offer.</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmOffer}
                  disabled={!selectedJobId || dispatchOfferMutation.isPending}
                  className="px-6 py-2.5 font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 text-xs"
                >
                  {dispatchOfferMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm & Dispatch Offer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

