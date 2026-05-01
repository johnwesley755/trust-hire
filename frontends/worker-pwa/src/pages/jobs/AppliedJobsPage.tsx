import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchMyApplications, fetchJobsByIds } from "../../store/slices/jobSlice";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AppliedJobsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appliedJobs: applications, jobs, loading: jobsLoading } = useAppSelector((state) => state.jobs);
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (open: boolean) => void }>();
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  useEffect(() => {
    if (applications?.length > 0) {
      const jobIds = Array.from(new Set(applications.map((application: any) => application.jobId)));
      dispatch(fetchJobsByIds(jobIds));
    }
  }, [dispatch, applications]);

  const jobsById = new Map(jobs.filter((job: any) => job.id || job.jobId).map((job: any) => [job.id || job.jobId, job]));

  const filteredApplications = (applications || []).filter((app: any) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Interviewing') return app.status === 'REVIEWING' || app.status === 'ACCEPTED';
    if (activeFilter === 'Pending') return app.status === 'PENDING';
    if (activeFilter === 'Offers') return app.status === 'ACCEPTED'; 
    return true;
  });

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1F3F34] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4EF] relative overflow-hidden flex flex-col selection:bg-[#FACD15] selection:text-[#1F3F34]">
      {/* Mobile Sticky Header */}
      <header className="lg:hidden flex justify-between items-center px-4 h-16 w-full fixed top-0 bg-[#F5F4EF]/80 backdrop-blur-md z-50 shadow-sm border-b border-[#1F3F34]/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#FACD15]/10 rounded-xl transition-colors active:scale-95 text-[#1F3F34]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-xl font-black text-[#1F3F34] tracking-tight bricolage">TrustHire</span>
        </div>
      </header>

      <main className="pt-24 lg:pt-12 px-4 lg:px-12 w-full max-w-7xl mx-auto lg:ml-0 pb-32">
        <div className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 lg:space-y-2">
            <h1 className="text-3xl lg:text-7xl font-black text-[#1F3F34] tracking-tight leading-none bricolage">
              Applied Jobs
            </h1>
            <p className="text-sm lg:text-xl text-[#1F3F34]/70 font-medium">
              Tracking {applications?.length || 0} active applications
            </p>
          </div>
        </div>

        <div className="flex lg:hidden gap-2 overflow-x-auto pb-6 no-scrollbar">
          {['All', 'Interviewing', 'Pending', 'Offers'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`${
                activeFilter === filter ? 'bg-[#FACD15] text-[#1F3F34]' : 'bg-[#EFEEE9] text-[#1F3F34]'
              } px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 shadow-sm`}
            >
              {filter} {filter === 'All' ? `(${applications?.length || 0})` : ''}
            </button>
          ))}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 lg:py-32 bg-white rounded-[32px] border-2 border-dashed border-[#1F3F34]/10 space-y-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#EFEEE9] rounded-full flex items-center justify-center mx-auto opacity-40">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl lg:text-4xl">assignment_late</span>
            </div>
            <p className="text-xl lg:text-2xl font-black text-[#1F3F34] tracking-tight bricolage">No applications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-8">
            {filteredApplications.map((app: any, index: number) => {
              const job = jobsById.get(app.jobId);
              const status = app.status;
              const isInterviewing = status === 'REVIEWING' || status === 'INTERVIEWING';
              const isRejected = status === 'REJECTED';
              const isOffer = status === 'ACCEPTED';
              const isLarge = index === 0 && isInterviewing;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    ${isLarge ? 'lg:col-span-2' : ''} 
                    ${isOffer ? 'bg-amber-50 border-2 border-[#FACD15]' : 'bg-white'} 
                    p-4 lg:p-8 rounded-xl lg:rounded-[24px] shadow-sm lg:shadow-xl group transition-all duration-300 relative overflow-hidden 
                    ${isInterviewing ? 'border-l-4 border-emerald-600' : (isRejected ? 'border-l-4 border-red-600' : 'border-l-4 border-[#FACD15]')}
                  `}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-0.5 lg:space-y-2">
                      <span className={`inline-block px-2 lg:px-3 py-0.5 lg:py-1 rounded-md lg:rounded-full uppercase tracking-wider text-[10px] font-black ${
                        isInterviewing ? 'bg-emerald-100 text-emerald-800' : 
                        isRejected ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {job?.industry || job?.category || 'Mission'}
                      </span>
                      <h3 className={`bricolage ${isLarge ? 'text-2xl lg:text-4xl' : 'text-lg lg:text-2xl'} font-black text-[#1F3F34] leading-tight tracking-tight`}>
                        {job?.title || "Role"}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 leading-none ${
                        isInterviewing ? 'bg-emerald-600 text-white' : 
                        isRejected ? 'bg-red-600 text-white' : 
                        isOffer ? 'bg-[#1F3F34] text-[#FACD15] animate-pulse' :
                        'bg-[#FACD15] text-[#1F3F34]'
                      }`}>
                        {isOffer ? 'OFFER RECEIVED' : (status === 'REVIEWING' ? 'INTERVIEWING' : status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs lg:text-sm text-[#1F3F34]/60 font-medium relative z-10">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      {job?.city || job?.location || 'Mission HQ'}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => navigate(`/job/${app.jobId}`)}
                      className="text-[#1F3F34] font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Details
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
