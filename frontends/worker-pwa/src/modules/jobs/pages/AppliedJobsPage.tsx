import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { applicationService } from "../../../services/application.service";
import { jobService } from "../../../services/job.service";
import { profileService } from '../../../services/profile.service';
import { NotificationCenter } from '../components/NotificationCenter';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../../../providers/AuthContext";

export default function AppliedJobsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (open: boolean) => void }>();
  const [activeFilter, setActiveFilter] = useState('All');

  // Suppress global dashboard header on mobile for this page
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      document.dispatchEvent(new CustomEvent('hideDashboardHeader'));
      return () => {
        document.dispatchEvent(new CustomEvent('showDashboardHeader'));
      };
    }
  }, []);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const jobIds = Array.from(new Set(applications.map((application) => application.jobId)));
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['appliedJobsPage', jobIds],
    queryFn: () => jobService.getJobsByIds(jobIds),
    enabled: jobIds.length > 0,
  });

  const jobsById = new Map(jobs.filter((job) => job.id).map((job) => [job.id!, job]));

  const filteredApplications = applications.filter(app => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Interviewing') return app.status === 'REVIEWING' || app.status === 'ACCEPTED';
    if (activeFilter === 'Pending') return app.status === 'PENDING';
    if (activeFilter === 'Offers') return app.status === 'ACCEPTED'; 
    return true;
  });

  if (isLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1F3F34] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4EF] relative overflow-hidden flex flex-col">
      {/* Mobile Sticky Header (Visible only on mobile) */}
      <header className="lg:hidden flex justify-between items-center px-4 h-16 w-full fixed top-0 bg-[#F5F4EF]/80 backdrop-blur-md z-50 shadow-sm border-b border-[#1F3F34]/5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#FACD15]/10 rounded-xl transition-colors active:scale-95 text-[#1F3F34]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-['Bricolage_Grotesque'] text-xl font-black text-[#1F3F34] tracking-tight">TrustHire</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <div className="w-8 h-8 rounded-full bg-[#c7ebdb] flex items-center justify-center overflow-hidden border border-[#1F3F34]/10">
            <img 
               src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"} 
               alt="Profile" 
               className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      {/* Floating Blobs for Organic Aesthetic (Desktop only) */}
      <div className="hidden lg:block fixed top-[15%] right-[-5%] w-[400px] h-[400px] bg-[#FACD15] opacity-[0.03] rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="hidden lg:block fixed bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#1F3F34] opacity-[0.02] rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Mobile Organic Blob */}
      <div className="fixed lg:hidden -bottom-24 -left-24 w-64 h-64 bg-[#FACD15] opacity-5 rounded-full blur-3xl pointer-events-none" />

      <main className="pt-24 lg:pt-12 px-4 lg:px-12 w-full max-w-7xl mx-auto lg:ml-0 pb-32">
        
        {/* Screen Header (Unified for mobile/desktop but styled per breakpoint) */}
        <div className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 lg:space-y-2">
            <h1 className="text-3xl lg:text-7xl lg:font-extrabold text-[#1F3F34] font-['Bricolage_Grotesque'] font-black tracking-tight leading-none lg:leading-[0.9]">
              Applied Jobs
            </h1>
            <p className="text-sm lg:text-xl text-[#1F3F34]/70 font-medium font-['Be_Vietnam_Pro']">
              Tracking {applications.length} active applications
            </p>
          </div>
          
          {/* Desktop Filter Cluster */}
          <div className="hidden md:flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F3F34] font-bold rounded-xl text-sm shadow-sm hover:bg-[#EFEEE9] transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1F3F34] font-bold rounded-xl text-sm shadow-sm hover:bg-[#EFEEE9] transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">sort</span>
              Sort by Date
            </button>
          </div>
        </div>

        {/* Mobile Filter Chips (Visible only on mobile) */}
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-6 no-scrollbar">
          {['All', 'Interviewing', 'Pending', 'Offers'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`${
                activeFilter === filter ? 'bg-[#FACD15] text-[#002117]' : 'bg-[#EFEEE9] text-[#1F3F34]'
              } px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 shadow-sm`}
            >
              {filter} {filter === 'All' ? `(${applications.length})` : ''}
            </button>
          ))}
        </div>

        {/* Bento Grid / Card List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 lg:py-32 bg-white rounded-[32px] border-2 border-dashed border-[#1F3F34]/10 space-y-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#EFEEE9] rounded-full flex items-center justify-center mx-auto opacity-40">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl lg:text-4xl">assignment_late</span>
            </div>
            <p className="text-xl lg:text-2xl font-black text-[#1F3F34] tracking-tight">No such applications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-8">
            {filteredApplications.map((app, index) => {
              const job = jobsById.get(app.jobId);
              const status = app.status;
              const isInterviewing = status === 'REVIEWING';
              const isRejected = status === 'REJECTED';
              const isOffer = status === 'ACCEPTED';
              
              // Desktop Logic
              const isLarge = index === 0 && isInterviewing;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    ${isLarge ? 'lg:col-span-2' : ''} 
                    ${isOffer ? 'bg-primary-fixed/10 border-2 border-[#FACD15]' : 'bg-white'} 
                    p-4 lg:p-8 rounded-xl lg:rounded-[24px] shadow-sm lg:shadow-[0_20px_40px_-10px_rgba(31,63,52,0.06)] 
                    flex flex-col gap-3 lg:justify-between group lg:hover:-translate-y-2 transition-all duration-300 relative overflow-hidden 
                    ${isInterviewing ? 'border-l-4 border-[#456559]' : (isRejected ? 'border-l-4 border-[#ba1a1a]' : 'border-l-4 border-[#FACD15]')}
                    lg:border-l-0 lg:border lg:border-transparent lg:hover:border-[#1F3F34]/5
                  `}
                >
                  {/* Desktop Background Sparkle */}
                  <div className="hidden lg:block absolute -top-4 -right-4 w-24 h-24 bg-[#FACD15]/5 rounded-full blur-2xl group-hover:bg-[#FACD15]/15 transition-all duration-700" />
                  
                  {/* Status & Identity Cluster */}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-0.5 lg:space-y-2">
                      <span className={`inline-block px-2 lg:px-3 py-0.5 lg:py-1 rounded-md lg:rounded-full uppercase tracking-wider lg:tracking-widest text-[10px] font-black lg:font-bold ${
                        isInterviewing ? 'bg-[#c7ebdb]/40 text-[#456559]' : 
                        isRejected ? 'bg-[#ffdad6] text-[#ba1a1a]' : 
                        'bg-[#FACD15]/10 text-[#FACD15]'
                      }`}>
                        {job?.industry || 'Construction'}
                      </span>
                      <h3 className={`font-headline ${isLarge ? 'text-2xl lg:text-4xl' : 'text-lg lg:text-2xl'} font-bold lg:font-extrabold text-[#1F3F34] leading-tight tracking-tight`}>
                        {job?.title || "Project Role"}
                      </h3>
                      {isLarge && <p className="hidden lg:block text-[#1F3F34]/60 font-medium mt-1">Larsen & Toubro • Primary Site</p>}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 leading-none ${
                        isInterviewing ? 'bg-[#c7ebdb] text-[#456559]' : 
                        isRejected ? 'bg-[#ffdad6] text-[#ba1a1a]' : 
                        isOffer ? 'bg-[#1F3F34] text-[#FACD15] animate-pulse' :
                        'bg-[#FACD15]/20 text-[#564500]'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isOffer ? 'workspace_premium' : (isInterviewing ? 'record_voice_over' : 'schedule')}
                        </span>
                        {isOffer ? 'OFFER RECEIVED' : (status === 'REVIEWING' ? 'INTERVIEWING' : status)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Stats (Mid-section) */}
                  {isLarge && (
                    <div className="hidden lg:grid md:grid-cols-3 gap-6 my-8 relative z-10">
                      <div className="p-4 bg-[#F5F4EF] rounded-xl flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-[#1F3F34]/50 uppercase tracking-widest">Location</p>
                        <p className="text-sm font-bold text-[#1F3F34]">Bangalore, KA</p>
                      </div>
                      <div className="p-4 bg-[#F5F4EF] rounded-xl flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-[#1F3F34]/50 uppercase tracking-widest">Budget</p>
                        <p className="text-sm font-bold text-[#1F3F34]">₹{(job?.budget || 0).toLocaleString()} Total</p>
                      </div>
                      <div className="p-4 bg-[#F5F4EF] rounded-xl flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-[#1F3F34]/50 uppercase tracking-widest">Timeline</p>
                        <p className="text-sm font-bold text-[#1F3F34]">6 Months</p>
                      </div>
                    </div>
                  )}

                  {/* Shared Info (Location/Date) */}
                  <div className="flex items-center gap-4 text-xs lg:text-sm text-[#1F3F34]/60 font-medium relative z-10">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg lg:text-xl text-[#1F3F34]/50">location_on</span>
                      {job?.city || 'Location unavailable'}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg lg:text-xl text-[#1F3F34]/50">calendar_today</span>
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className={`pt-2 lg:pt-6 flex justify-between items-center relative z-10 ${!isLarge ? 'lg:border-t lg:border-[#EFEEE9]' : ''}`}>
                    {isLarge ? (
                      <div className="hidden lg:flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-[#EFEEE9] shadow-sm overflow-hidden"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" /></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-[#FACD15] flex items-center justify-center text-[10px] font-black">+2</div>
                      </div>
                    ) : (
                      <div className="flex -space-x-2 lg:hidden">
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-[#FACD15]"></div>
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-[#456559]"></div>
                      </div>
                    )}
                    
                    {isOffer && <span className="text-[10px] lg:text-xs font-black text-[#ba1a1a] uppercase">Expires in 2 days</span>}

                    <button 
                      onClick={() => navigate(`/job/${app.jobId}`)}
                      className={`
                        ${isLarge ? 'px-8 py-3 bg-[#1F3F34] text-[#FACD15] rounded-xl shadow-lg hover:scale-105 active:scale-95' : 'text-[#1F3F34] lg:px-4 lg:py-2 lg:bg-[#F5F4EF] lg:rounded-xl'} 
                        font-bold text-xs lg:text-sm transition-all flex items-center gap-1 border-b-2 lg:border-none border-[#FACD15] lg:border-0 pb-1 lg:pb-2
                      `}
                    >
                      {isOffer ? 'Review Offer' : (isLarge ? 'View Full Details' : 'View Details')}
                      <span className="material-symbols-outlined text-lg lg:block hidden">chevron_right</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Area (Mobile Style) */}
        {filteredApplications.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4 lg:hidden">
            <button className="w-full py-4 bg-[#EFEEE9] rounded-xl text-sm font-bold text-[#1F3F34]/60 hover:bg-[#E9E8E3] active:scale-95 transition-all">
              Load previous applications
            </button>
            <p className="text-[10px] text-[#1F3F34]/40 font-bold uppercase tracking-[0.2em]">End of active records</p>
          </div>
        )}

        {/* Desktop Pagination Style */}
        {filteredApplications.length > 0 && (
          <div className="hidden lg:flex justify-center mt-16">
            <nav className="inline-flex items-center gap-2 p-2 bg-white rounded-2xl shadow-sm border border-[#1F3F34]/5">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#EFEEE9] transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FACD15] text-[#1F3F34] font-bold text-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#EFEEE9] transition-colors text-sm font-bold opacity-40">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#EFEEE9] transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
}
