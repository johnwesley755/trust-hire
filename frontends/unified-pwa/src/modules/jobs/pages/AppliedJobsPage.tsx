import { useQuery } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { applicationService } from "../../../services/application.service";
import { jobService } from "../../../services/job.service";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "../../../providers/AuthContext";
import { 
  CheckCircle2, Clock, MapPin, Calendar, 
  ChevronRight, Sparkles, ShieldCheck, AlertCircle, 
  FileText, Briefcase, Zap, ArrowRight
} from "lucide-react";

export default function AppliedJobsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const [activeFilter, setActiveFilter] = useState('All');

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
    if (activeFilter === 'Reviewing') return app.status === 'REVIEWING';
    if (activeFilter === 'Pending') return app.status === 'PENDING';
    if (activeFilter === 'Offers') return app.status === 'ACCEPTED'; 
    return true;
  });

  if (isLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <main className="pt-6 px-4 sm:px-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Screen Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                My Shift Applications
              </h1>
              <span className="bg-blue-50 text-[#0066FF] text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Live Pipeline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tracking {applications.length} submitted shift applications & escrow guarantees
            </p>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'Reviewing', 'Offers'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`${
                  activeFilter === filter 
                    ? 'bg-[#0066FF] text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-[#0066FF] font-semibold'
                } px-3.5 py-1.5 rounded-lg text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap`}
              >
                {filter} {filter === 'All' ? `(${applications.length})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* List of Applications */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">No applications in this view</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Discover instant shifts in your area and apply with 1-click verified credentials.
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Explore Available Shifts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredApplications.map((app, index) => {
              const job = jobsById.get(app.jobId);
              const status = app.status;
              const isReviewing = status === 'REVIEWING';
              const isRejected = status === 'REJECTED';
              const isOffer = status === 'ACCEPTED' || status === 'COMPLETED';
              
              const statusStep = isOffer ? 3 : isReviewing ? 2 : isRejected ? -1 : 1;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`bg-white p-5 rounded-2xl border ${
                    isOffer ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30' : 'border-slate-200/80 shadow-xs'
                  } flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden`}
                >
                  {/* Top Bar */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {job?.industry || 'General Trade'}
                        </span>
                        {isOffer && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" /> Shift Offer
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-[#0066FF] transition-colors truncate">
                        {job?.title || "Trade Shift"}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                        {(job as any)?.employerName || 'Verified Enterprise Partner'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ₹{(job?.budget || 0).toLocaleString()}
                      </span>
                      <span className="text-[9px] text-emerald-600 font-bold block uppercase tracking-wider">
                        Escrow Ready
                      </span>
                    </div>
                  </div>

                  {/* Swiggy-style 3-step timeline */}
                  <div className="my-4 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2 text-slate-600">
                      <span className={`flex items-center gap-1 ${statusStep >= 1 ? 'text-[#0066FF] font-bold' : 'text-slate-400'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                      </span>
                      <span className={`flex items-center gap-1 ${statusStep >= 2 ? 'text-[#0066FF] font-bold' : 'text-slate-400'}`}>
                        <Clock className="w-3.5 h-3.5" /> Shortlisted
                      </span>
                      <span className={`flex items-center gap-1 ${statusStep >= 3 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                        <Sparkles className="w-3.5 h-3.5" /> Approved & Hired
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isOffer ? 'bg-emerald-500' : 'bg-[#0066FF]'}`}
                        style={{ width: `${isOffer ? 100 : isReviewing ? 66 : 33}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Details & Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                        {job?.city || 'Local area'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button 
                      onClick={() => navigate(`/job/${app.jobId}`)}
                      className="text-xs font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      {isOffer ? 'Review & Accept Offer' : 'View Shift'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
