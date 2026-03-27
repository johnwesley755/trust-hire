import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService, type JobApplication } from '../api/application.service';
import { jobService } from '../api/job.service';
import { workerService } from '../../search/api/worker.service';
import { CheckCircle, XCircle, Clock, User, ChevronRight, Loader2, ShieldCheck, MapPin, BadgeCheck, IndianRupee, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data: jobs, isLoading: isJobsLoading } = useQuery({ 
    queryKey: ['employerJobs'], 
    queryFn: jobService.getEmployerJobs 
  });
  
  const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
  
  const { data: allApplications, isLoading: isAppsLoading } = useQuery({
      queryKey: ['allEmployerApplications', jobIds],
      queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
      enabled: jobIds.length > 0,
  });

  const selectedJobApplications = allApplications?.filter(app => app.jobId === selectedJobId) || [];
  const workerIds = selectedJobApplications.map((app) => app.workerId);
  
  const { data: workers = [] } = useQuery({
    queryKey: ['jobSpecificWorkers', selectedJobId, workerIds],
    queryFn: () => workerService.getProfilesByUserIds(workerIds),
    enabled: selectedJobId !== null && workerIds.length > 0,
  });

  const workersById = new Map(workers.map((worker) => [worker.userId, worker]));

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: JobApplication['status'] }) => 
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEmployerApplications'] });
      queryClient.invalidateQueries({ queryKey: ['jobSpecificWorkers'] });
    }
  });

  const getApplicationCountForJob = (jobId: string) => {
    return allApplications?.filter(app => app.jobId === jobId).length || 0;
  };

  const selectedJob = jobs?.find(j => j.id === selectedJobId);

  if (isJobsLoading || (isAppsLoading && !allApplications)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[#1F3F34] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30">Syncing Pipeline...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F4EF] p-4 md:p-8 lg:p-12">
      <AnimatePresence mode="wait">
        {!selectedJobId ? (
          <motion.div
            key="job-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#1F3F34] tracking-tighter leading-none">
                  Workforce Pipeline
                </h1>
                <p className="text-[#1F3F34]/60 max-w-xl font-medium leading-relaxed">
                  You have {jobs?.length || 0} active roles currently accepting applications. Real-time updates on candidate activity are reflected below.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white px-6 py-3 rounded-2xl flex items-center gap-3 border border-[#1F3F34]/5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FACD15] animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]">
                    {allApplications?.length || 0} Total Applicants
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs?.map((job) => (
                <motion.div
                  key={job.id}
                  layoutId={job.id}
                  className="bg-white rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden group hover:shadow-2xl hover:shadow-[#1F3F34]/5 transition-all duration-500 border border-[#1F3F34]/5 cursor-pointer"
                  onClick={() => setSelectedJobId(job.id!)}
                >
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FACD15]/5 rounded-full blur-3xl group-hover:bg-[#FACD15]/10 transition-colors duration-500"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                      job.status === 'OPEN' 
                        ? 'bg-[#C7EBDB] text-on-secondary-fixed border-[#C7EBDB]' 
                        : 'bg-[#F5F4EF] text-[#1F3F34]/40 border-[#F5F4EF]'
                    }`}>
                      {job.status === 'OPEN' ? 'Active' : 'Draft'}
                    </span>
                    <span className="text-[10px] font-black text-[#1F3F34]/20 uppercase tracking-widest">#{job.id?.substring(0, 8)}</span>
                  </div>

                  <div className="mb-6 relative z-10">
                    <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight mb-2 group-hover:text-[#FACD15] transition-colors">{job.title}</h3>
                    <p className="text-sm text-[#1F3F34]/60 font-medium line-clamp-1">{job.description}</p>
                  </div>

                  <div className="space-y-4 mb-10 relative z-10">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-4 h-4 text-[#FACD15]" />
                      <span className="text-sm font-black text-[#1F3F34]">₹{job.budget?.toLocaleString()} / month</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#FACD15]" />
                      <span className="text-sm font-bold text-[#1F3F34]/70">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[#FACD15]" />
                      <span className="text-sm font-bold text-[#1F3F34]/70">
                        {getApplicationCountForJob(job.id!)} New Applications
                      </span>
                    </div>
                  </div>

                  <button className="mt-auto w-full bg-[#FACD15] text-[#1F3F34] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-[#FACD15]/10 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all">
                    View Applications
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              <motion.div
                className="bg-[#F5F4EF] border-2 border-dashed border-[#1F3F34]/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-[#FACD15] transition-all duration-500 cursor-pointer"
                onClick={() => navigate('/post-job')}
              >
                <div className="w-20 h-20 bg-[#FACD15] rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-[#FACD15]/20 group-hover:scale-110 group-hover:rotate-12 transition-all">
                  <Plus className="w-10 h-10 text-[#1F3F34]" />
                </div>
                <h4 className="text-xl font-black text-[#1F3F34] mb-2 tracking-tight">Create Opening</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30 max-w-[180px]">
                  Add a new role to your workforce pipeline
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="applicant-list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-7xl mx-auto"
          >
            <button 
              onClick={() => setSelectedJobId(null)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 hover:text-[#1F3F34] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Pipeline
            </button>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-[#FACD15] text-[#1F3F34] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {selectedJob?.status || 'Active'}
                </span>
                <span className="text-[10px] font-black text-[#1F3F34]/20 uppercase tracking-widest">Reference #{selectedJobId.substring(0, 8)}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1F3F34] tracking-tighter mb-4">
                {selectedJob?.title}
              </h1>
              <p className="text-[#1F3F34]/60 font-medium max-w-2xl">{selectedJob?.description}</p>
            </div>

            <div className="space-y-6">
              {selectedJobApplications.map((app, idx) => {
                const worker = workersById.get(app.workerId);
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-[#1F3F34]/5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FACD15]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center relative z-10">
                      <div className="flex-1 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#F5F4EF] shadow-inner group-hover:scale-105 transition-transform duration-500">
                            {worker?.profileImageUrl ? (
                              <img src={worker.profileImageUrl} alt={worker.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#1F3F34]/20">
                                {worker?.fullName?.[0] || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-[#1F3F34] text-[#FACD15] text-[10px] font-black px-2.5 py-1 rounded-lg border-4 border-white shadow-lg">
                            LVL {worker?.level || 'L1'}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight">{worker?.fullName || 'Anonymous Applicant'}</h3>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30">
                              <MapPin className="w-3 h-3 text-[#FACD15]" />
                              {worker?.city || 'Location Pending'}
                              <span className="w-1 h-1 bg-[#1F3F34]/10 rounded-full"></span>
                              <Clock className="w-3 h-3 text-[#FACD15]" />
                              Applied {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {worker?.skills?.split(',').slice(0, 4).map(skill => (
                              <span key={skill} className="px-3 py-1.5 bg-[#F5F4EF] text-[#1F3F34]/60 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#1F3F34]/5">
                                {skill.trim()}
                              </span>
                            )) || <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/20 italic">No Skills Listed</span>}
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-72 space-y-4 pt-6 lg:pt-0 lg:border-l lg:border-[#1F3F34]/5 lg:pl-10">
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30">Protocol Execution</span>
                           <ShieldCheck className="w-4 h-4 text-[#FACD15]" />
                        </div>
                        
                        <div className="space-y-3">
                          {app.status === 'PENDING' ? (
                            <div className="flex flex-col gap-3">
                              <button 
                                onClick={() => mutation.mutate({ id: app.id!, status: 'ACCEPTED' })}
                                className="w-full py-4 bg-[#FACD15] text-[#1F3F34] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FACD15]/10 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" /> Approve Operative
                              </button>
                              <button 
                                onClick={() => mutation.mutate({ id: app.id!, status: 'REJECTED' })}
                                className="w-full py-4 bg-white border border-[#1F3F34]/5 text-[#1F3F34]/40 hover:text-rose-600 hover:bg-rose-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                              >
                                Terminate Request
                              </button>
                            </div>
                          ) : (
                            <div className={`w-full py-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border flex items-center justify-center gap-2 ${
                              app.status === 'ACCEPTED' 
                                ? 'bg-[#C7EBDB] text-on-secondary-fixed border-[#C7EBDB]' 
                                : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                              {app.status === 'ACCEPTED' ? <BadgeCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              {app.status === 'ACCEPTED' ? 'Operative Approved' : 'Request Denied'}
                            </div>
                          )}
                          <button 
                            onClick={() => navigate(`/worker/${app.workerId}`)}
                            className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 hover:text-[#1F3F34] transition-colors"
                          >
                            View Full Dossier
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {selectedJobApplications.length === 0 && (
                <div className="text-center py-40 bg-[#F5F4EF] rounded-[3.5rem] border-2 border-dashed border-[#1F3F34]/10 space-y-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <User className="w-10 h-10 text-[#1F3F34]/10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight">Pipeline Empty</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/30 max-w-xs mx-auto">
                      No professionals have applied for this specific tactical role yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
