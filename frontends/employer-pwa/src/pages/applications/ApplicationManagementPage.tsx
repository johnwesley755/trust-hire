import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyJobs } from '../../store/slices/jobSlice';
import { fetchApplicationsForEmployerJobs, updateApplicationStatus } from '../../store/slices/applicationSlice';
import { fetchProfilesByUserIds } from '../../store/slices/searchSlice';
import { 
    CheckCircle, XCircle, Clock, User, ChevronRight, 
    Loader2, MapPin, BadgeCheck, 
    IndianRupee, ArrowLeft, Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { myJobs: jobs, loading: jobsLoading } = useAppSelector((state) => state.jobs);
  const { applications, loading: appsLoading } = useAppSelector((state) => state.applications);
  const { workers } = useAppSelector((state) => state.search);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const jobIds = useMemo(() => jobs.map((j: any) => j.id).filter((id: any): id is string => !!id), [jobs]);

  useEffect(() => {
    if (jobIds.length > 0) {
      dispatch(fetchApplicationsForEmployerJobs(jobIds));
    }
  }, [dispatch, jobIds]);

  const selectedJobApplications = useMemo(() => 
    applications.filter(app => app.jobId === selectedJobId), 
    [applications, selectedJobId]
  );

  const workerIds = useMemo(() => 
    selectedJobApplications.map((app) => app.workerId), 
    [selectedJobApplications]
  );

  useEffect(() => {
    if (selectedJobId && workerIds.length > 0) {
      dispatch(fetchProfilesByUserIds(workerIds));
    }
  }, [dispatch, selectedJobId, workerIds]);

  const workersById = useMemo(() => 
    new Map(workers.map((worker) => [worker.userId, worker])), 
    [workers]
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
        await dispatch(updateApplicationStatus({ id, status })).unwrap();
    } catch (err) {
        console.error("Status update failed:", err);
    }
  };

  const getApplicationCountForJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };

  const selectedJob = jobs.find((j: any) => j.id === selectedJobId);

  const isLoading = jobsLoading || (jobIds.length > 0 && appsLoading && applications.length === 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-16 h-16 text-[#1F3F34] animate-spin opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/30 animate-pulse">Syncing Tactical Intel...</p>
      </div>
    );
  } 

  return (
    <main className="min-h-screen bg-[#F5F4EF] p-4 lg:p-12 selection:bg-[#FACD15] selection:text-[#1F3F34]">
      <AnimatePresence mode="wait">
        {!selectedJobId ? (
          <motion.div
            key="job-list"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="max-w-[1600px] mx-auto text-left"
          >
            <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage leading-[0.9]">
                  Asset<br/>
                  <span className="text-[#1F3F34]/30">Acquisition</span>
                </h1>
                <p className="text-[#1F3F34]/60 max-w-2xl font-medium text-lg leading-relaxed">
                  Overseeing {jobs.length} active deployment clusters. Monitor real-time operative engagement and authorize clearance protocols below.
                </p>
              </div>
              <div className="flex gap-6">
                <div className="bg-white px-8 py-4 rounded-[2rem] flex items-center gap-4 border border-[#EFEEE9] shadow-2xl shadow-[#1F3F34]/5">
                  <span className="w-3 h-3 rounded-full bg-[#FACD15] animate-ping"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]">
                    {applications.length} Operatives Mobilized
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobs.map((job: any) => (
                <motion.div
                  key={job.id}
                  layoutId={job.id}
                  className="bg-white rounded-[3.5rem] p-10 flex flex-col relative overflow-hidden group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 border border-[#EFEEE9] cursor-pointer"
                  onClick={() => setSelectedJobId(job.id!)}
                >
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FACD15] opacity-[0.03] rounded-full blur-[80px] group-hover:bg-[#FACD15]/10 transition-colors duration-1000"></div>
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <span className={`px-5 py-2 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border-2 ${
                      job.status === 'OPEN' 
                        ? 'bg-[#C7EBDB] text-[#4a6b5e] border-[#C7EBDB]' 
                        : 'bg-[#F5F4EF] text-[#1F3F34]/20 border-[#F5F4EF]'
                    }`}>
                      {job.status === 'OPEN' ? 'ACTIVE HUB' : 'OFFLINE'}
                    </span>
                    <span className="text-[9px] font-black text-[#1F3F34]/20 uppercase tracking-[0.3em]">REF-{job.id?.substring(0, 8).toUpperCase()}</span>
                  </div>

                  <div className="mb-8 relative z-10">
                    <h3 className="text-3xl font-black text-[#1F3F34] tracking-tight mb-3 group-hover:text-[#FACD15] transition-colors duration-500 uppercase bricolage">{job.title}</h3>
                    <p className="text-sm text-[#1F3F34]/40 font-bold uppercase tracking-widest line-clamp-1">{job.description}</p>
                  </div>

                  <div className="space-y-6 mb-12 relative z-10">
                    <div className="flex items-center gap-4">
                      <IndianRupee className="w-5 h-5 text-[#FACD15]" />
                      <span className="text-sm font-black text-[#1F3F34]">₹{job.budget?.toLocaleString()} <span className="opacity-30">/ MO</span></span>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-[#FACD15]" />
                      <span className="text-sm font-bold text-[#1F3F34]/70 uppercase tracking-widest truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <User className="w-5 h-5 text-[#FACD15]" />
                      <span className="text-sm font-black text-[#1F3F34] uppercase tracking-tighter">
                        {getApplicationCountForJob(job.id!)} Tactical Inquiries
                      </span>
                    </div>
                  </div>

                  <button className="mt-auto w-full bg-[#1F3F34] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-[#1F3F34]/20 hover:bg-[#FACD15] hover:text-[#1F3F34] hover:-translate-y-1 active:scale-95 transition-all duration-500">
                    ANALYZE CANDIDATES
                    <ChevronRight className="w-5 h-5 ml-2 inline-block font-black" />
                  </button>
                </motion.div>
              ))}

              <motion.div
                className="bg-[#EFEEE9]/50 border-4 border-dashed border-[#1F3F34]/10 rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-[#FACD15]/50 transition-all duration-700 cursor-pointer min-h-[500px]"
                onClick={() => navigate('/post-job')}
              >
                <div className="w-24 h-24 bg-[#FACD15] rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-[#FACD15]/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                  <Plus className="w-12 h-12 text-[#1F3F34] font-black" />
                </div>
                <h4 className="text-2xl font-black text-[#1F3F34] mb-4 tracking-tighter uppercase bricolage">EXPAND FLEET</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 max-w-[200px] leading-relaxed">
                  INITIALIZE NEW OPERATIONAL BREACH
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="applicant-list"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="max-w-[1600px] mx-auto text-left"
          >
            <button 
              onClick={() => setSelectedJobId(null)}
              className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/30 hover:text-[#FACD15] transition-all mb-12 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-3 transition-transform" />
              RETURN TO HUB
            </button>

            <div className="mb-20">
              <div className="flex items-center gap-6 mb-8">
                <span className="bg-[#FACD15] text-[#1F3F34] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#FACD15]/20">
                  {selectedJob?.status || 'OPERATIONAL'}
                </span>
                <span className="text-[10px] font-black text-[#1F3F34]/20 uppercase tracking-[0.4em]">ZONE REFERENCE #{selectedJobId.substring(0, 8).toUpperCase()}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#1F3F34] tracking-tighter mb-8 uppercase bricolage leading-[0.9]">
                {selectedJob?.title}
              </h1>
              <p className="text-xl text-[#1F3F34]/60 font-medium max-w-4xl leading-relaxed italic border-l-8 border-[#FACD15] pl-10">"{selectedJob?.description}"</p>
            </div>

            <div className="space-y-10">
              {selectedJobApplications.map((app: any, idx: number) => {
                const worker = workersById.get(app.workerId) as any;
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[3.5rem] p-10 lg:p-14 border border-[#EFEEE9] shadow-2xl shadow-[#1F3F34]/5 hover:shadow-[#1F3F34]/10 transition-all duration-700 group relative overflow-hidden"
                  >
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FACD15]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#FACD15]/10 transition-colors duration-1000"></div>
                    
                    <div className="flex flex-col lg:flex-row gap-16 items-start lg:items-center relative z-10">
                      <div className="flex-1 flex flex-col md:flex-row gap-12 items-start md:items-center">
                        <div className="relative shrink-0">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden bg-[#F5F4EF] shadow-inner group-hover:scale-105 group-hover:-rotate-3 transition-all duration-700 border-4 border-white ring-1 ring-[#EFEEE9] grayscale-[0.2] group-hover:grayscale-0">
                            {worker?.profileImageUrl ? (
                              <img src={worker.profileImageUrl} alt={worker.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl font-black text-[#1F3F34]/10">
                                {worker?.fullName?.[0] || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-3 -right-3 bg-[#1F3F34] text-[#FACD15] text-[10px] font-black px-4 py-2 rounded-2xl border-4 border-white shadow-2xl shadow-[#1F3F34]/40">
                            LVL {worker?.level || 'L1'}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h3 className="text-3xl md:text-4xl font-black text-[#1F3F34] tracking-tight uppercase bricolage">{worker?.fullName || 'IDENT_PENDING'}</h3>
                            <div className="flex flex-wrap items-center gap-6 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/30">
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#FACD15]" />
                                {worker?.city || 'SECTOR UNKNOWN'}
                              </p>
                              <span className="w-2 h-2 bg-[#FACD15] rounded-full opacity-40"></span>
                              <p className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#FACD15]" />
                                DEPLOYED {new Date(app.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {worker?.skills?.split(',').slice(0, 5).map((skill: any) => (
                              <span key={skill} className="px-4 py-2 bg-[#F5F4EF] text-[#1F3F34]/60 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-[#EFEEE9] hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all cursor-default">
                                {skill.trim()}
                              </span>
                            )) || <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/10 italic">MISSING SKILLSET INTEL</span>}
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-[400px] space-y-6 pt-10 lg:pt-0 lg:border-l lg:border-[#EFEEE9] lg:pl-16">
                        <div className="space-y-4">
                          {app.status === 'PENDING' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                              <button 
                                onClick={() => handleStatusUpdate(app.id!, 'ACCEPTED')}
                                className="w-full py-6 bg-[#FACD15] text-[#1F3F34] rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#FACD15]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                              >
                                <CheckCircle className="w-5 h-5 group-hover/btn:scale-125 transition-transform" /> AUTHORIZE
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(app.id!, 'REJECTED')}
                                className="w-full py-6 bg-white border-2 border-[#EFEEE9] text-[#1F3F34]/30 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-95"
                              >
                                ABORT
                              </button>
                            </div>
                          ) : (
                            <div className={`w-full py-8 rounded-[2rem] text-center text-[11px] font-black uppercase tracking-[0.4em] border-2 flex flex-col items-center justify-center gap-4 ${
                              app.status === 'ACCEPTED' 
                                ? 'bg-[#C7EBDB]/30 text-[#4a6b5e] border-[#C7EBDB]' 
                                : 'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-xl ${app.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {app.status === 'ACCEPTED' ? <BadgeCheck className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                              </div>
                              {app.status === 'ACCEPTED' ? 'PROTOCOL AUTHORIZED' : 'MISSION ABORTED'}
                            </div>
                          )}
                          <button 
                            onClick={() => navigate(`/worker/${app.workerId}`)}
                            className="w-full py-4 text-[9px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/20 hover:text-[#1F3F34] transition-all flex items-center justify-center gap-3"
                          >
                            OPEN DOSSIER
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {selectedJobApplications.length === 0 && (
                <div className="text-center py-56 bg-[#EFEEE9]/30 rounded-[4rem] border-4 border-dashed border-[#1F3F34]/5 space-y-10 shadow-inner">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9]">
                    <User className="w-14 h-14 text-[#1F3F34]/10" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">NO INTEL DETECTED</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20 max-w-[280px] mx-auto leading-relaxed">
                      Zero operatives have initiated deployment sequences for this tactical cluster.
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
