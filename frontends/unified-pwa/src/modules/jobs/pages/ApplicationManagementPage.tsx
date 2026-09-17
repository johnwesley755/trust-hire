import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService, type JobApplication } from '../../../services/application.service';
import { jobService } from '../../../services/job.service';
import { workerService } from '../../../services/worker.service';
import { queryKeys } from '../../../lib/queryKeys';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  ChevronRight, 
  Loader2, 
  MapPin, 
  BadgeCheck, 
  IndianRupee, 
  ArrowLeft, 
  Plus, 
  Briefcase, 
  Sparkles,
  ShieldCheck,
  Star,
  PhoneCall,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from '../../../components/common/UserAvatar';

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'OFFER_SENT' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const { data: jobs = [], isLoading: isJobsLoading } = useQuery<import('../../../types').Job[]>({ 
    queryKey: queryKeys.jobs.employerJobs, 
    queryFn: jobService.getEmployerJobs 
  });
  
  const jobIds = jobs.map((j: import('../../../types').Job) => j.id).filter((id): id is string => !!id);
  
  const { data: allApplicationsRaw = [], isLoading: isAppsLoading } = useQuery<JobApplication[]>({
    queryKey: queryKeys.jobs.allEmployerApplications(jobIds),
    queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
    enabled: jobIds.length > 0,
  });

  const allApplications = allApplicationsRaw;

  const selectedJobApplications = allApplications.filter(app => {
    if (app.jobId !== selectedJobId) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACCEPTED') return app.status === 'ACCEPTED' || app.status === 'APPROVED';
    if (statusFilter === 'REJECTED') return app.status === 'REJECTED' || app.status === 'DECLINED';
    return app.status === statusFilter;
  });

  const workerIds = selectedJobApplications.map((app) => app.workerId);
  
  const { data: workers = [] } = useQuery({
    queryKey: queryKeys.workers.byUserIds(workerIds),
    queryFn: () => workerService.getProfilesByUserIds(workerIds),
    enabled: selectedJobId !== null && workerIds.length > 0,
  });

  const workersById = new Map<string, any>();
  workers.forEach((worker) => {
    if (worker.userId) workersById.set(worker.userId, worker);
    if (worker.id) workersById.set(worker.id, worker);
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: JobApplication['status'] }) => 
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employer.profile });
    }
  });

  const getApplicationCountForJob = (jobId: string) => {
    return allApplications.filter(app => app.jobId === jobId).length;
  };

  const getPendingCountForJob = (jobId: string) => {
    return allApplications.filter(app => app.jobId === jobId && app.status === 'PENDING').length;
  };

  const selectedJob = jobs.find((j: import('../../../types').Job) => j.id === selectedJobId);

  if (isJobsLoading || (isAppsLoading && !allApplications)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Syncing Applicants Feed...</p>
      </div>
    );
  } 

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <AnimatePresence mode="wait">
        {!selectedJobId ? (
          <motion.div
            key="job-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Hiring & Dispatch Console
                </div>
                <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">
                  Active Openings & Applications
                </h1>
                <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
                  Select an opening to review candidates, inspect credentials, and manage dispatch.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 border border-slate-200 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-700">
                    {allApplications?.length || 0} Total Received
                  </span>
                </div>
                <button
                  onClick={() => navigate('/post-job')}
                  className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Post New Shift
                </button>
              </div>
            </div>

            {/* Grid of Job Postings */}
            {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto mt-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-[#0A1931] mb-2 uppercase tracking-tight">No Active Jobs</h3>
                    <p className="text-slate-500 font-medium mb-6 text-sm">You currently don't have any active job postings. Once you post a new shift, it will appear here for you to manage applications and track performance.</p>
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" /> Post Your First Job
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                  {jobs.map((job: import('../../../types').Job, idx: number) => {
                    const pendingCount = getPendingCountForJob(job.id!);
                    const totalCount = getApplicationCountForJob(job.id!);
                    const isUrgent = Boolean(job.description?.toLowerCase().includes('urgent'));

                    return (
                        <motion.div 
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-4 rounded-xl group hover:shadow-md hover:border-[#0066FF] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between border border-slate-200 relative overflow-hidden cursor-pointer"
                            onClick={() => setSelectedJobId(job.id!)}
                        >
                            {/* Left Side: Job Info */}
                            <div className="flex-1 min-w-0 pr-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-base sm:text-lg font-extrabold text-[#0A1931] tracking-tight truncate group-hover:text-[#0066FF] transition-colors">
                                        {job.title}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full tracking-widest uppercase shrink-0 ${
                                        isUrgent ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#d1fae5] text-[#4a6b5e]'
                                    }`}>
                                        {isUrgent ? 'URGENT' : 'ACTIVE'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#0A1931]/60 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <span className="truncate max-w-[120px]">{job.industry}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4 text-slate-400" />
                                        <span className="font-bold text-[#0A1931]">₹{job.budget?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="truncate max-w-[150px]">{job.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Stats & Action */}
                            <div className="flex items-center gap-8 mt-6 md:mt-0 shrink-0 md:border-l md:border-slate-100 md:pl-8">
                                <div className="text-center md:text-right">
                                    <span className="block text-[10px] uppercase font-black tracking-widest text-[#0A1931]/40 mb-1">
                                        Candidates
                                    </span>
                                    <div className="flex items-center gap-3 justify-center md:justify-end">
                                        <span className="text-lg font-black text-[#0A1931]">
                                            {totalCount} <span className="text-sm font-bold text-slate-400">Total</span>
                                        </span>
                                        {pendingCount > 0 && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                                                <Sparkles className="w-3 h-3 text-amber-500" /> {pendingCount} New
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center justify-center w-12 h-12 bg-slate-50 text-[#0A1931] group-hover:bg-[#0066FF] group-hover:text-white rounded-xl transition-colors">
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    );
                  })}
                </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="applicant-list"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Back Button & Job Breadcrumb */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedJobId(null)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0066FF] transition-colors py-2 px-3 bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Openings
              </button>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  {selectedJob?.status || 'Active'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ID: #{selectedJobId.substring(0, 8)}
                </span>
              </div>
            </div>

            {/* Selected Job Banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-[#0A1931] tracking-tight">
                  {selectedJob?.title}
                </h1>
                <p className="text-sm text-slate-500 font-medium max-w-2xl">
                  {selectedJob?.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-2">
                  <span className="flex items-center gap-1 text-[#0066FF]">
                    <IndianRupee className="w-3.5 h-3.5" /> ₹{selectedJob?.budget?.toLocaleString()} / month
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedJob?.location}
                  </span>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start md:self-auto overflow-x-auto pb-2">
                {(['ALL', 'PENDING', 'OFFER_SENT', 'ACCEPTED', 'REJECTED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === filter
                        ? 'bg-white text-[#0066FF] shadow-sm'
                        : 'text-slate-600 hover:text-[#0A1931]'
                    }`}
                  >
                    {filter === 'ALL' 
                      ? 'All Applicants' 
                      : filter === 'PENDING' 
                        ? 'Under Review' 
                        : filter === 'OFFER_SENT' 
                          ? 'Offers Sent' 
                          : filter === 'ACCEPTED' 
                            ? 'Approved' 
                            : 'Declined'}
                  </button>
                ))}
              </div>
            </div>

            {/* Applicants List */}
            <div className="space-y-4">
              {selectedJobApplications.map((app: JobApplication, idx: number) => {
                const worker = workersById.get(app.workerId);
                const candidateName = worker?.fullName || worker?.name || 'Candidate';
                const candidateLevel = worker?.level || 'L1';
                const ratingDisplay = worker?.rating ? Number(worker.rating).toFixed(1) : (worker?.trustScore ? (worker.trustScore / 20).toFixed(1) : '4.8');
                const locationDisplay = worker?.city || worker?.location || worker?.address || 'Location on file';
                const isVerified = Boolean(worker?.identityVerified || worker?.isVerified);

                const rawSkills = worker?.skills;
                const skillsArray = Array.isArray(rawSkills) 
                  ? rawSkills 
                  : typeof rawSkills === 'string' && rawSkills.trim().length > 0 
                    ? rawSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : [];

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-3xl p-6 md:p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                      {/* Worker Info */}
                      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
                        <div className="relative shrink-0">
                          <UserAvatar 
                            src={worker?.profileImageUrl} 
                            name={candidateName} 
                            size="lg" 
                          />
                          <div className="absolute -bottom-1 -right-1 bg-[#0A1931] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg border-2 border-white shadow-sm">
                            {candidateLevel}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-[#0A1931]">
                              {candidateName}
                            </h3>
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-200">
                                <BadgeCheck className="w-3.5 h-3.5" /> ID Verified
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                Verification Pending
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-xs font-extrabold border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {ratingDisplay}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                              {locationDisplay}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              Applied {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                            {worker?.phoneNumber && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-700 font-bold">
                                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                                  {worker.phoneNumber}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {skillsArray.length > 0 ? (
                              skillsArray.slice(0, 4).map((skill: string) => (
                                <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">General Trade</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action / Status Panel */}
                      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
                        {app.status === 'PENDING' ? (
                          <>
                            <button 
                              onClick={() => mutation.mutate({ id: app.id!, status: 'ACCEPTED' })}
                              disabled={mutation.isPending}
                              className="w-full py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Approve & Hire
                            </button>
                            <button 
                              onClick={() => mutation.mutate({ id: app.id!, status: 'REJECTED' })}
                              disabled={mutation.isPending}
                              className="w-full py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" /> Decline
                            </button>
                          </>
                        ) : app.status === 'OFFER_SENT' ? (
                          <div className="w-full py-3 rounded-xl text-center text-xs font-bold border border-amber-200 bg-amber-50 text-amber-700 flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            Offer Sent (Awaiting Response)
                          </div>
                        ) : (
                          <div className={`w-full py-3 rounded-xl text-center text-xs font-bold border flex items-center justify-center gap-2 ${
                            (app.status === 'ACCEPTED' || app.status === 'APPROVED')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {(app.status === 'ACCEPTED' || app.status === 'APPROVED') ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {(app.status === 'ACCEPTED' || app.status === 'APPROVED') ? 'Approved for Dispatch' : 'Declined'}
                          </div>
                        )}

                        <button 
                          onClick={() => navigate(`/worker/${app.workerId}`)}
                          className="w-full py-2 text-xs font-bold text-slate-500 hover:text-[#0066FF] transition-colors cursor-pointer"
                        >
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {selectedJobApplications.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1931]">No Candidates Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {statusFilter === 'ALL' 
                      ? 'No candidates have applied for this specific role yet. Try promoting the job or searching nearby workers.'
                      : `No applicants currently under the "${statusFilter}" status.`}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

