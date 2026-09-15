import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
import apiClient from '../../../api/apiClient';
import { useState } from 'react';
import { NotificationCenter } from '../../dashboard/components/NotificationCenter';
import { formatMissingProfileFields, getMissingProfileFields } from '../../../utils/profileCompletion';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [hasJustApplied, setHasJustApplied] = useState(() => {
    return localStorage.getItem(`applied_${id}`) === 'true';
  });
  const [coverLetter, setCoverLetter] = useState('');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id!),
    enabled: !!id
  });

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: myApplications = [], refetch: refetchApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const { data: employer } = useQuery({
    queryKey: ['employer', job?.employerId],
    queryFn: async () => {
        const res = await apiClient.get(`/api/employer/profile/${job?.employerId}`);
        return res.data;
    },
    enabled: !!job?.employerId
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof applicationService.applyForJob>[0]) => applicationService.applyForJob(data),
    onSuccess: (newApp: any) => {
      setHasJustApplied(true);
      localStorage.setItem(`applied_${id}`, 'true');
      queryClient.setQueryData<any[]>(['myApplications'], (old = []) => [
        ...(old || []),
        newApp || { id: `app-${Date.now()}`, jobId: id!, status: 'PENDING' }
      ]);
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        setHasJustApplied(true);
        localStorage.setItem(`applied_${id}`, 'true');
        return;
      }
      alert(message);
    }
  });

  const handleApply = () => {
    const missingFields = getMissingProfileFields(profile);
    if (missingFields.length > 0) {
      alert(`Complete your profile before applying. Missing: ${formatMissingProfileFields(missingFields)}.`);
      navigate('/profile');
      return;
    }
    mutation.mutate({ jobId: id!, coverLetter });
  };

  const alreadyApplied = hasJustApplied || myApplications.some((application) => application.jobId === id);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen bg-slate-50 text-slate-900 p-8">Job not found.</div>;

  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm"
        >
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <span className="material-symbols-outlined text-3xl font-black">check_circle</span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
            Opportunity Confirmed
          </div>

          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0A1931] tracking-tight mb-3">
            Application Submitted!
          </h1>
          
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-8 font-medium">
            Your credentials and TrustScore have been securely transmitted to the client. You can monitor status updates directly from your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto px-6 py-3 bg-[#0A1931] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
            >
              View My Applications
            </button>
            <button 
              onClick={() => navigate('/search')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Browse More Jobs
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative pb-24 min-h-screen bg-[#F8FAFC]">
      {/* Mobile Sticky Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 flex items-center justify-between px-4 py-3 lg:hidden border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all text-[#0A1931]"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <h1 className="text-base font-bold text-[#0A1931] tracking-tight truncate max-w-[200px]">{job.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Section */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-slate-100 text-[#0A1931] rounded-lg text-xs font-bold uppercase tracking-wider">
                {job.industry || 'General Trade'}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                TrustVerified Client
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#0066FF]">location_on</span>
                {job.address || job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <span className="material-symbols-outlined text-base text-slate-400">payments</span>
                ₹{job.budget?.toLocaleString()} Budget
              </span>
            </div>
          </section>

          {/* Scope Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-[#0A1931] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#0066FF] rounded-full"></span>
              Scope of Work
            </h3>
            
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
              <div className="whitespace-pre-wrap font-medium">
                {job.description}
              </div>
              
              {job.description?.includes('\n') && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Execution Breakdown</h4>
                  <ul className="space-y-2.5">
                    {job.description.split('\n').filter((line: string) => line.trim().length > 0).map((line: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start text-xs sm:text-sm">
                        <span className="text-[#0066FF] font-bold">{(i + 1).toString().padStart(2, '0')}.</span>
                        <span>{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Application Action Strip */}
          <div className="bg-[#0A1931] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Ready to start this shift?</h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                Applying instantly shares your TrustScore and verified trade certificates.
              </p>
            </div>
            
            <button 
              onClick={handleApply}
              disabled={mutation.isPending}
              className="w-full sm:w-auto px-6 py-3 bg-[#FACD15] hover:bg-amber-400 text-[#0A1931] font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              <span>{mutation.isPending ? 'Submitting...' : 'Apply Now'}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Desktop-Only Right Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Budget Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Project Allocation</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0A1931]">₹{(job.budget || 0).toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">Total</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">Payout Structure</span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-bold">Milestone Based</span>
            </div>
          </div>

          {/* Client Status Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A1931] shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Hiring Partner</p>
              <h4 className="text-sm font-bold text-[#0A1931] truncate">
                {employer?.companyName || 'Verified Corporate'}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {employer?.isVerified ? 'Verified Enterprise' : 'Registered Partner'}
              </p>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0066FF] shrink-0">
              <span className="material-symbols-outlined text-2xl">event_upcoming</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Application Window</p>
              {job.expiresAt ? (() => {
                const exp = new Date(job.expiresAt);
                const days = Math.ceil((exp.getTime() - Date.now()) / 86400000);
                return (
                  <div>
                    <h4 className="text-sm font-bold text-[#0A1931]">
                      {exp.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </h4>
                    <p className={`text-xs font-bold mt-0.5 ${
                      days < 0 ? 'text-red-500' : days <= 3 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {days < 0 ? 'Expired' : days === 0 ? 'Closes today' : `${days} days left`}
                    </p>
                  </div>
                );
              })() : (
                <div>
                  <h4 className="text-sm font-bold text-[#0A1931]">Open-ended</h4>
                  <p className="text-xs text-slate-500 font-medium">Rolling applications</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Mini Map */}
          <div className="rounded-2xl overflow-hidden relative h-44 bg-slate-100 border border-slate-200 shadow-xs">
            {job.latitude && job.longitude ? (
              <div className="w-full h-full relative z-0">
                <MapContainer 
                  center={[job.latitude, job.longitude]} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[job.latitude, job.longitude]}>
                    <Popup>
                      <div className="p-1">
                        <h4 className="font-bold text-xs text-[#0A1931]">{job.title}</h4>
                        <p className="text-[10px] text-slate-500">{job.location}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs p-2 rounded-lg flex items-center justify-between border border-slate-200 z-[1000]">
                  <span className="text-[10px] font-bold truncate text-[#0A1931] max-w-[140px]">{job.address || job.location}</span>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`, '_blank')}
                    className="text-[9px] font-bold text-[#0A1931] bg-[#FACD15] px-2.5 py-1 rounded-md uppercase tracking-wider hover:scale-105 transition-all cursor-pointer"
                  >
                    Directions
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-3xl mb-1">location_off</span>
                <p className="text-[10px] font-bold uppercase tracking-wider">Location data missing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .organic-blob {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        .leaflet-container {
            width: 100%;
            height: 100%;
            font-family: inherit;
        }
        .leaflet-control-zoom {
            border: none !important;
            margin: 16px !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
            background-color: white !important;
            color: #0A1931 !important;
            border: 1px solid rgba(0,0,0,0.1) !important;
            border-radius: 8px !important;
            margin-bottom: 4px !important;
        }
      `}</style>
    </div>
  );
}
