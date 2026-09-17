import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerService } from '../../../services/worker.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
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

export const WorkerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');

  // Fallback state if they haven't refreshed
  const [isOfferSent, setIsOfferSent] = useState(() => {
    return localStorage.getItem(`offerSent_${id}`) === 'true';
  });

  const { data: myJobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['myJobs'],
    queryFn: () => jobService.getMyJobs(),
    enabled: isModalOpen
  });

  const dispatchOfferMutation = useMutation({
    mutationFn: (jobId: string) => applicationService.dispatchOffer({ jobId, workerId: id || '' }),
    onSuccess: () => {
      setIsOfferSent(true);
      localStorage.setItem(`offerSent_${id}`, 'true');
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    }
  });

  const handleDispatchOffer = () => {
    setIsModalOpen(true);
  };

  const handleConfirmOffer = () => {
    if (selectedJobId) {
      dispatchOfferMutation.mutate(selectedJobId);
    }
  };

  useEffect(() => {
    if (id) {
        workerService.incrementProfileView(id).catch(err => console.error("Failed to increment profile view:", err));
    }
  }, [id]);

  const { data: worker, isLoading: isLoadingWorker } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workerService.getWorkerById(id || ''),
    enabled: !!id
  });

  const { data: ratings } = useQuery({
    queryKey: ['workerRatings', id],
    queryFn: () => workerService.getWorkerRatings(id || ''),
    enabled: !!id
  });

  if (isLoadingWorker) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-[#0066FF] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Loading Profile</p>
    </div>
  );

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
                 <button 
                   onClick={handleDispatchOffer}
                   disabled={isOfferSent || worker?.isOfferSent}
                   className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer ${
                     (isOfferSent || worker?.isOfferSent) ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[#0066FF] hover:bg-[#0052cc] text-white'
                   }`}
                 >
                   {(isOfferSent || worker?.isOfferSent) ? 'Offer Sent!' : 'Dispatch Offer'}
                 </button>
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
                      <div className="col-span-full py-6 text-center text-slate-500 font-medium">
                        No skills listed
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Contact & Stats */}
              <div className="space-y-6">
                
                {/* Contact Info */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-[#0A1931] mb-4">Contact Details</h3>
                  <div className="space-y-4">
                    {(() => {
                      const phone = worker?.phoneNumber || (worker as any)?.phone_number || (worker as any)?.user_metadata?.phone_number;
                      const email = worker?.email || (worker as any)?.user_metadata?.email;

                      return (
                        <>
                          {phone ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0066FF] shrink-0">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                                <p className="font-semibold text-slate-700 truncate">{phone}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500 font-medium">Phone number not available.</div>
                          )}
                          
                          {email && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0066FF] shrink-0">
                                <Mail className="w-4 h-4" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                                <p className="font-semibold text-slate-700 truncate">{email}</p>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Job Stats */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-[#0A1931] mb-4">Worker Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</p>
                      <p className="text-xl font-black text-[#0A1931] mt-1">
                        {ratings && ratings.length > 0 ? (ratings.reduce((acc: any, r: any) => acc + r.score, 0) / ratings.length).toFixed(1) : 'New'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level</p>
                      <p className="text-xl font-black text-[#0A1931] mt-1">{worker?.level || 1}</p>
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
                <h2 className="text-xl font-black text-[#0A1931]">Dispatch Offer</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-slate-600 font-medium mb-4">
                  Select a job to offer to {worker?.name || 'this worker'}:
                </p>
                
                {isLoadingJobs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
                  </div>
                ) : myJobs && myJobs.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {myJobs.map((job: any) => (
                      <label 
                        key={job.id}
                        className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedJobId === job.id 
                            ? 'border-[#0066FF] bg-blue-50/50' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="jobSelection" 
                          className="mt-1 sr-only"
                          checked={selectedJobId === job.id}
                          onChange={() => setSelectedJobId(job.id)}
                        />
                        <div className="flex-1 ml-1">
                          <h4 className={`font-bold ${selectedJobId === job.id ? 'text-[#0066FF]' : 'text-[#0A1931]'}`}>
                            {job.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">
                            {job.location} • ₹{job.budget?.toLocaleString() || '0'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedJobId === job.id ? 'border-[#0066FF]' : 'border-slate-300'
                        }`}>
                          {selectedJobId === job.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500 font-medium">You don't have any active jobs to offer.</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmOffer}
                  disabled={!selectedJobId || dispatchOfferMutation.isPending}
                  className="px-6 py-2.5 font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {dispatchOfferMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Offer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
