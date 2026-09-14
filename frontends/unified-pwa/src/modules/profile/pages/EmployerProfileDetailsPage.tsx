import { useEffect, useState } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { profileService, type EmployerProfile } from "../../../services/profile.service";
import { dashboardService } from "../../../services/dashboard.service";
import { jobService, type Job } from "../../../services/job.service";
import { NotificationCenter } from '../../dashboard/components/NotificationCenter';
import { Building2, MapPin, Briefcase, Edit2, ShieldCheck, Users, Clock, ArrowRight, Activity, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function EmployerProfileDetailsPage() {
  const { logout } = useAuth();
  const { user } = useUser();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const setIsSidebarOpen = outletCtx?.setIsSidebarOpen || (() => {});

  const { data: profile } = useQuery<EmployerProfile>({
    queryKey: ['employerProfile'],
    queryFn: profileService.getEmployerProfile,
  });

  const { data: stats } = useQuery({
    queryKey: ['employerStats'],
    queryFn: dashboardService.getEmployerStats,
  });

  const { data: jobs } = useQuery<Job[]>({
    queryKey: ['employerJobs'],
    queryFn: jobService.getMyJobs,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#0A1931] hover:bg-slate-100 p-2 rounded-full active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <h1 className="text-lg font-black text-[#0A1931] tracking-tight">TrustHyre</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 space-y-6">
        
        {/* Page Header (Desktop) */}
        <div className="hidden lg:flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-black text-[#0A1931] tracking-tight">Employer Profile</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your company details and job postings.</p>
          </div>
        </div>

        {/* TOP BANNER / HEADER (Flattened Layout) */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066FF] to-[#facc15]"></div>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
              {profile?.profileImageUrl || user?.profileImageUrl ? (
                <img src={profile?.profileImageUrl || user?.profileImageUrl} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0A1931]">{profile?.companyName || user?.companyName || 'Company Name'}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {profile?.industry || 'Enterprise'}
                </span>
                <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profile?.address || profile?.city || 'Location not specified'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/50 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Verified Corporate
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/post-job" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold rounded-xl shadow-md transition-all whitespace-nowrap">
              <Briefcase className="w-4 h-4" /> Post New Shift
            </Link>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-sm transition-all whitespace-nowrap">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* ANALYTICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0066FF]">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Active Jobs</p>
              <h3 className="text-3xl font-black text-[#0A1931] mt-1">{stats?.activeJobs || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Hired</p>
              <h3 className="text-3xl font-black text-[#0A1931] mt-1">{stats?.totalHired || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Applicants</p>
              <h3 className="text-3xl font-black text-[#0A1931] mt-1">{stats?.totalApplicants || 0}</h3>
            </div>
          </div>
        </div>

        {/* RECENT JOB OPENINGS LIST */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-lg font-black text-[#0A1931]">Recent Job Openings</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage your latest shifts and openings.</p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-1.5 text-[#0066FF] font-bold text-sm hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-slate-100">
            {(!jobs || jobs.length === 0) ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-[#0A1931] mb-2">No Job Openings Yet</h4>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't posted any jobs or shifts. Create one now to start hiring workers.</p>
                <Link to="/post-job" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0066FF] text-white font-bold rounded-xl hover:bg-[#0052cc] transition-colors">
                  <Briefcase className="w-4 h-4" /> Post Your First Job
                </Link>
              </div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-5 justify-between items-start md:items-center group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-[#0A1931] text-lg">{job.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        job.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' :
                        job.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location || job.city || 'Remote'}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {format(new Date(job.createdAt), 'MMM d, yyyy')}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {job.applicationCount || 0} Applicants</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Link to={`/jobs/${job.id}`} className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-[#0066FF] hover:bg-blue-50 font-bold rounded-lg text-sm text-center transition-colors">
                      View Details
                    </Link>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-sm text-center transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-red-600 hover:bg-red-50 font-bold rounded-lg text-sm text-center transition-colors">
                      Close Job
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {jobs && jobs.length > 5 && (
            <div className="p-4 border-t border-slate-100 text-center sm:hidden">
              <Link to="/jobs" className="text-[#0066FF] font-bold text-sm hover:underline">
                View All Jobs
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
