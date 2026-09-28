import { useEffect, useState, useRef } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { profileService, type EmployerProfile } from "../../../services/profile.service";
import { dashboardService } from "../../../services/dashboard.service";
import { jobService, type Job } from "../../../services/job.service";
import { queryKeys } from "../../../lib/queryKeys";
import { Building2, MapPin, Briefcase, Edit2, ShieldCheck, Users, Clock, ArrowRight, Activity, Calendar, Camera, Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { EditEmployerProfileModal } from "../components/EditEmployerProfileModal";

export default function EmployerProfileDetailsPage() {
  const { user } = useUser();
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const setIsSidebarOpen = outletCtx?.setIsSidebarOpen || (() => {});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoFeedback, setLogoFeedback] = useState<string | null>(null);

  const { data: profile } = useQuery<EmployerProfile | null>({
    queryKey: queryKeys.employer.profile,
    queryFn: profileService.getEmployerProfile,
  });

  const { data: stats } = useQuery({
    queryKey: queryKeys.employer.stats,
    queryFn: dashboardService.getEmployerStats,
  });

  const { data: jobs } = useQuery<Job[]>({
    queryKey: queryKeys.jobs.employerJobs,
    queryFn: jobService.getMyJobs,
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image file is too large (max 10MB).");
      return;
    }

    setIsUploadingLogo(true);
    setLogoFeedback(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        let compressedDataUrl = event.target?.result as string;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        try {
          await profileService.updateEmployerProfile({
            profileImageUrl: compressedDataUrl,
            profile_image_url: compressedDataUrl
          } as any);

          updateUser({
            ...user,
            profileImageUrl: compressedDataUrl,
            profile_image_url: compressedDataUrl
          });

          queryClient.setQueryData(queryKeys.employer.profile, (old: any) => ({
            ...(old || {}),
            profileImageUrl: compressedDataUrl,
            profile_image_url: compressedDataUrl
          }));
          queryClient.invalidateQueries({ queryKey: queryKeys.employer.profile });

          setLogoFeedback("Company logo updated successfully!");
          setTimeout(() => setLogoFeedback(null), 4000);
        } catch (err) {
          console.error("Failed to update company logo:", err);
          alert("Failed to update company logo. Please try again.");
        } finally {
          setIsUploadingLogo(false);
        }
      };
      img.onerror = () => {
        alert("Failed to process image file.");
        setIsUploadingLogo(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert("Failed to read file.");
      setIsUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* MOBILE HEADER - Removed because EmployerLayout already provides it */}
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
          
          <input 
            type="file"
            ref={logoInputRef}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleLogoUpload}
            className="hidden"
          />

          <div className="flex items-center gap-6">
            <div 
              onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
              title="Click to change company logo"
              className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0 relative group cursor-pointer"
            >
              {profile?.profileImageUrl || (profile as any)?.profile_image_url || user?.profileImageUrl || (user as any)?.profile_image_url ? (
                <img 
                  src={profile?.profileImageUrl || (profile as any)?.profile_image_url || user?.profileImageUrl || (user as any)?.profile_image_url} 
                  alt="Company Logo" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Building2 className="w-10 h-10 text-slate-300" />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                {isUploadingLogo ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-[#0A1931]">{profile?.companyName || user?.companyName || 'Company Name'}</h2>
              </div>

              {logoFeedback && (
                <div className="mt-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-md inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{logoFeedback}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {profile?.industry || 'Enterprise'}
                </span>
                <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profile?.address || profile?.city || 'Location not specified'}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                  profile?.isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <ShieldCheck className="w-4 h-4" /> {profile?.isVerified ? 'Verified Corporate' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/post-job" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold rounded-xl shadow-md transition-all whitespace-nowrap">
              <Briefcase className="w-4 h-4" /> Post a Job
            </Link>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* COMPANY & CONTACT DETAILS CARD */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-[#0A1931]">Company & Contact Information</h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-[#0066FF] rounded-lg">Official Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400">Phone Number</p>
              <p className="text-base font-extrabold text-[#0A1931] mt-1">
                {profile?.phoneNumber || (user as any)?.phone_number || user?.phoneNumber || 'Not Provided'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400">Official Business Email</p>
              <p className="text-base font-extrabold text-[#0A1931] mt-1 truncate">
                {profile?.email || user?.email || 'Not Provided'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400">Authorized Contact</p>
              <p className="text-base font-extrabold text-[#0A1931] mt-1">
                {profile?.contactPerson || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Managing Director'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold uppercase text-slate-400">Operating City / Region</p>
              <p className="text-base font-extrabold text-[#0A1931] mt-1">
                {profile?.city || profile?.location || 'Pan India'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
              <p className="text-xs font-bold uppercase text-slate-400">Registered Office Address</p>
              <p className="text-base font-bold text-[#0A1931] mt-1">
                {profile?.address || 'Corporate office address registered during onboarding'}
              </p>
            </div>
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
              <p className="text-sm text-slate-500 font-medium mt-1">Manage your latest job postings and openings.</p>
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
                <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't posted any jobs yet. Create one now to start hiring workers.</p>
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
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {job.createdAt && !isNaN(new Date(job.createdAt).getTime()) ? format(new Date(job.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
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

      <EditEmployerProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile || undefined}
      />
    </div>
  );
}
