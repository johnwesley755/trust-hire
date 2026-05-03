import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { profileService } from '../../../services/profile.service';
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
  const [hasJustApplied, setHasJustApplied] = useState(false);
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
    onSuccess: async () => {
      setHasJustApplied(true);
      await refetchApplications();
    },
    onError: async (error: unknown) => {
      const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        setHasJustApplied(true);
        await refetchApplications();
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

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#1F3F34] border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen bg-slate-50 text-slate-900 p-8">Job not found.</div>;

  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] relative overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Success Header Branding */}
        <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <div className="text-xl font-['Bricolage_Grotesque'] font-extrabold tracking-tight text-[#1F3F34]">
           Trust Hire
          </div>
          <div className="hidden lg:flex gap-6 items-center">
            <span className="material-symbols-outlined text-[#1F3F34] cursor-pointer">share</span>
            <span className="material-symbols-outlined text-[#1F3F34] cursor-pointer">bookmark</span>
          </div>
        </header>

        {/* Organic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FACD15] opacity-10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#456559] opacity-10 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl bg-white rounded-[24px] p-10 lg:p-20 text-center shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] border border-[#1F3F34]/5"
        >
          {/* Success Icon */}
          <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#c7ebdb] text-[#456559] shadow-inner">
            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>

          <h1 className="font-['Bricolage_Grotesque'] font-extrabold text-4xl lg:text-6xl text-[#1F3F34] tracking-tight mb-6 leading-tight">
            Application sent!
          </h1>
          
          <p className="text-[#414845] text-lg lg:text-xl leading-relaxed max-w-md mx-auto mb-12 font-medium opacity-80">
            Your profile has been shared with the hiring team. You will be notified of the outcome via the dashboard.
          </p>

          {/* Action Cluster */}
          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center px-10 py-5 bg-[#1F3F34] text-[#FACD15] font-['Bricolage_Grotesque'] font-extrabold uppercase tracking-wider rounded-xl shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => navigate('/applied-jobs')}
              className="text-[#414845] font-bold text-sm uppercase tracking-widest hover:text-[#1F3F34] transition-colors mt-2"
            >
              View Application Details
            </button>
          </div>

          {/* Bento Hint Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-8 bg-[#EFEEE9] rounded-[24px] flex flex-col gap-3 group hover:bg-[#E9E8E3] transition-all">
              <span className="material-symbols-outlined text-[#456559] text-3xl group-hover:scale-110 transition-transform">notifications_active</span>
              <div>
                <h3 className="font-['Bricolage_Grotesque'] font-bold text-[#1F3F34] text-lg">Stay Notified</h3>
                <p className="text-sm text-[#414845] font-medium opacity-70 leading-snug">We&apos;ll alert you as soon as there&apos;s an update on your status.</p>
              </div>
            </div>
            <div className="p-8 bg-[#EFEEE9] rounded-[24px] flex flex-col gap-3 group hover:bg-[#E9E8E3] transition-all">
              <span className="material-symbols-outlined text-[#456559] text-3xl group-hover:scale-110 transition-transform">explore</span>
              <div>
                <h3 className="font-['Bricolage_Grotesque'] font-bold text-[#1F3F34] text-lg">Keep Exploring</h3>
                <p className="text-sm text-[#414845] font-medium opacity-70 leading-snug">Browse 120+ similar opportunities in your local neighborhood.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative pb-32 min-h-screen">
      {/* Mobile Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#F5F4EF]/80 backdrop-blur-md z-[60] flex items-center justify-between px-6 py-4 lg:hidden border-b border-[#1F3F34]/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FACD15]/10 active:scale-95 transition-all text-[#1F3F34]"
          >
            <span className="material-symbols-outlined font-black">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-[#1F3F34] tracking-tight">Opportunity Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <button className="p-2 rounded-full hover:bg-[#FACD15]/10 lg:hidden text-[#1F3F34]">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FACD15]/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-5%] left-[20%] w-[400px] h-[400px] bg-[#1F3F34]/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 pt-24 lg:pt-12 p-6 lg:p-12 lg:pr-16 w-full max-w-7xl mx-auto lg:ml-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Section */}
          <section className="relative space-y-4">
            {/* Mobile Decorative Blob */}
            <div className="absolute lg:hidden -top-10 -right-10 w-32 h-32 bg-[#FACD15] opacity-5 organic-blob -z-10" />
            
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-[#1F3F34] text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-[#1F3F34]/5">
                <span className="material-symbols-outlined text-[14px]">carpenter</span>
                {job.industry}
              </span>
              <span className="px-4 py-1.5 bg-[#FACD15] text-[#1F3F34] rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                TrustVerified
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1F3F34] leading-[0.95] tracking-tight">
              {job.title}
            </h1>
            
            <div className="flex items-center gap-2 text-[#1F3F34]/60 font-bold">
              <span className="material-symbols-outlined text-xl">location_on</span>
              <span>{job.location}</span>
            </div>
          </section>

          {/* Mobile-Only Projected Budget Card */}
          <section className="lg:hidden bg-white rounded-[24px] p-8 shadow-sm border-b-4 border-[#FACD15]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/50 mb-1">Projected Budget</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-[#1F3F34]">₹{job.budget?.toLocaleString()}</h2>
              <span className="text-[#1F3F34]/60 font-bold text-sm">Total Project</span>
            </div>
          </section>

          {/* Mobile-Only Meta-Grid (Status/Timeline) */}
          <section className="lg:hidden grid grid-cols-2 gap-4">
            <div className="bg-[#EFEEE9] rounded-[24px] p-6 flex flex-col justify-between aspect-square">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl">verified_user</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40">Client Status</p>
                <p className="text-lg font-black text-[#1F3F34]">5-Star Elite</p>
              </div>
            </div>
            <div className="bg-[#EFEEE9] rounded-[24px] p-6 flex flex-col justify-between aspect-square">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl">event_upcoming</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40">Timeline</p>
                <p className="text-lg font-black text-[#1F3F34]">14 Days</p>
              </div>
            </div>
          </section>

          {/* Scope Card */}
          <div className="bg-white rounded-[24px] p-8 lg:p-10 shadow-sm border border-transparent transition-all hover:shadow-xl hover:shadow-[#1F3F34]/5 group relative overflow-hidden">
            <div className="absolute lg:hidden top-0 right-0 w-24 h-24 bg-[#EFEEE9] organic-blob -mr-10 -mt-10 opacity-30" />
            
            <h3 className="text-2xl font-black mb-6 text-[#1F3F34] flex items-center gap-3">
              <span className="material-symbols-outlined lg:hidden">assignment</span>
              <span className="hidden lg:block w-1.5 h-6 bg-[#FACD15] rounded-full group-hover:scale-y-110 transition-transform"></span>
              Scope of Work
            </h3>
            
            <div className="space-y-6 text-[#1F3F34] leading-relaxed relative z-10">
              <div className="text-xl font-bold leading-snug opacity-90 lg:opacity-100 italic lg:not-italic whitespace-pre-wrap">
                {job.description}
              </div>
              
              {/* Optional: If we want to show it as bullets if it has multiple lines */}
              {job.description?.includes('\n') && (
                <div className="mt-8 pt-8 border-t border-[#1F3F34]/5">
                  <h4 className="text-sm font-black uppercase tracking-widest text-[#1F3F34]/30 mb-6">Execution Details</h4>
                  <ul className="space-y-4 font-medium opacity-90">
                    {job.description.split('\n').filter(line => line.trim().length > 0).map((line, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="text-[#FACD15] font-black">{(i + 1).toString().padStart(2, '0')}.</span>
                        <span>{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Application Form Card */}
          <div className="bg-[#1F3F34] text-[#F5F4EF] rounded-[24px] p-8 lg:p-10 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FACD15]/10 rounded-full blur-3xl transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-2 tracking-tight italic">Ready to start?</h3>
              <p className="text-[#F5F4EF]/70 font-medium mb-8">Briefly state your experience and immediate availability for this role.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#FACD15]">Your Proposal & Experience</label>
                  <textarea 
                    className="w-full bg-[#162e26] border-none rounded-2xl p-6 text-[#F5F4EF] placeholder:text-[#F5F4EF]/20 focus:ring-2 focus:ring-[#FACD15] transition-all resize-none text-base font-medium min-h-[160px]" 
                    placeholder="Explain why you're the best fit for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl lg:hidden">
                  <span className="material-symbols-outlined text-[#FACD15]">info</span>
                  <p className="text-[10px] leading-tight opacity-70 font-medium">Submitting will share your TrustScore and verified certificates with the client.</p>
                </div>

                <button 
                  onClick={handleApply}
                  disabled={mutation.isPending}
                  className="w-full bg-[#FACD15] text-[#1F3F34] font-extrabold lg:font-black text-sm lg:text-xl py-4 lg:py-6 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-[#FACD15]/10 disabled:opacity-50 uppercase tracking-widest"
                >
                  <span>{mutation.isPending ? 'Processing...' : 'Submit Application'}</span>
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop-Only Right Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Budget Card */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15]/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#1F3F34]/60 mb-2">Project Allocation</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#1F3F34]">₹{(job.budget || 0).toLocaleString()}</span>
              <span className="text-sm font-bold opacity-60">Total</span>
            </div>
            <div className="mt-8 pt-8 border-t border-[#1F3F34]/5 flex items-center justify-between">
              <span className="text-sm font-bold">Payout Structure</span>
              <span className="text-sm px-3 py-1 bg-[#F5F4EF] rounded-lg font-bold">Milestone Based</span>
            </div>
          </div>

          {/* Client Status Card */}
          <div className="bg-[#EFEEE9] rounded-[24px] p-8 flex items-center gap-6 group hover:bg-surface-variant transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#1F3F34] flex items-center justify-center text-[#FACD15] shadow-lg group-hover:rotate-3 transition-transform">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Client Status</p>
              <h4 className="text-lg font-black leading-tight text-[#1F3F34] truncate max-w-[180px]">
                {employer?.companyName || 'Verified Partner'}
              </h4>
              <p className="text-sm font-medium opacity-70">
                {employer?.isVerified ? 'Verified Partner' : 'Registered Partner'}
              </p>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-[24px] p-8 flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className="w-16 h-16 rounded-2xl bg-[#FACD15]/20 flex items-center justify-center text-[#1F3F34] group-hover:-rotate-3 transition-transform">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Timeline</p>
              <h4 className="text-lg font-black leading-tight text-[#1F3F34]">Active today</h4>
              <p className="text-sm font-medium opacity-70">Immediate Integration</p>
            </div>
          </div>

          {/* Location Mini Map - Interactive Leaflet */}
          <div className="rounded-[24px] overflow-hidden relative h-48 bg-[#EFEEE9] shadow-sm group">
            {job.latitude && job.longitude ? (
              <div className="w-full h-full relative z-0">
                <MapContainer 
                  center={[job.latitude, job.longitude]} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  className="w-full h-full grayscale-[0.2]"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[job.latitude, job.longitude]}>
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-black text-[#1F3F34]">{job.title}</h4>
                        <p className="text-xs text-[#414845] font-medium">{job.location}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
                {/* Brand Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl flex items-center justify-between border border-[#1F3F34]/5 z-[1000]">
                  <span className="text-[10px] font-bold truncate text-[#1F3F34] px-2 max-w-[200px]">{job.address || job.location}</span>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`, '_blank')}
                    className="text-[9px] font-black text-[#1F3F34] bg-[#FACD15] px-3 py-1.5 rounded-lg uppercase tracking-tighter hover:scale-105 transition-all"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#1F3F34]/40 bg-[#EFEEE9]">
                <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Location Data Missing</p>
              </div>
            )}
          </div>

          {/* Support Card */}
          <div className="p-8 border-2 border-dashed border-[#1F3F34]/10 rounded-[24px] flex flex-col items-center text-center space-y-4">
            <p className="text-sm font-bold opacity-60 mb-2">Questions about this role?</p>
            <button className="text-[#1F3F34] font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Talk to trust advisor
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>
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
            color: #1F3F34 !important;
            border: 1px solid rgba(0,0,0,0.1) !important;
            border-radius: 8px !important;
            margin-bottom: 4px !important;
        }
      `}</style>
    </div>
  );
}
