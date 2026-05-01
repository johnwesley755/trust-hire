import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchJobById, applyForJob, fetchMyApplications } from '../../store/slices/jobSlice';
import { fetchProfile } from '../../store/slices/profileSlice';
import { useState, useEffect } from 'react';
import { formatMissingProfileFields, getMissingProfileFields } from '../../core/utils/profileCompletion';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../../api/apiClient';

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
  const dispatch = useAppDispatch();
  const [hasJustApplied, setHasJustApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [employer, setEmployer] = useState<any>(null);

  const { currentJob: job, loading: jobLoading, appliedJobs } = useAppSelector((state) => state.jobs);
  const { profile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
      dispatch(fetchMyApplications());
      dispatch(fetchProfile());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (job?.employerId) {
      apiClient.get(`/api/employer/profile/${job.employerId}`)
        .then(res => setEmployer(res.data.data))
        .catch(err => console.error("Failed to fetch employer profile:", err));
    }
  }, [job?.employerId]);

  const handleApply = async () => {
    const missingFields = getMissingProfileFields(profile);
    if (missingFields.length > 0) {
      alert(`Complete your profile before applying. Missing: ${formatMissingProfileFields(missingFields)}.`);
      navigate('/profile');
      return;
    }
    
    try {
      await dispatch(applyForJob({ jobId: id!, coverLetter })).unwrap();
      setHasJustApplied(true);
      dispatch(fetchMyApplications());
    } catch (err: any) {
      const message = err || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        setHasJustApplied(true);
        dispatch(fetchMyApplications());
        return;
      }
      alert(message);
    }
  };

  const alreadyApplied = hasJustApplied || appliedJobs?.some((application: any) => application.jobId === id);

  if (jobLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#1F3F34] border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen bg-slate-50 text-slate-900 p-8">Job not found.</div>;

  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-[#F5F4EF] relative overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12">
        <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <div className="text-xl font-black tracking-tight text-[#1F3F34] bricolage">
           Trust Hire
          </div>
        </header>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FACD15] opacity-10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#456559] opacity-10 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl bg-white rounded-[24px] p-10 lg:p-20 text-center shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] border border-[#1F3F34]/5"
        >
          <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#c7ebdb] text-[#456559] shadow-inner">
            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>

          <h1 className="font-black text-4xl lg:text-6xl text-[#1F3F34] tracking-tight mb-6 leading-tight bricolage">
            Application sent!
          </h1>
          
          <p className="text-[#414845] text-lg lg:text-xl leading-relaxed max-w-md mx-auto mb-12 font-medium opacity-80">
            Your profile has been shared with the hiring team. You will be notified of the outcome via the dashboard.
          </p>

          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center px-10 py-5 bg-[#1F3F34] text-[#FACD15] font-black uppercase tracking-wider rounded-xl shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all duration-300"
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative pb-32 min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
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
      </header>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FACD15]/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-5%] left-[20%] w-[400px] h-[400px] bg-[#1F3F34]/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 pt-24 lg:pt-12 p-6 lg:p-12 lg:pr-16 w-full max-w-7xl mx-auto lg:ml-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="lg:col-span-8 space-y-8">
          <section className="relative space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-[#1F3F34] text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-[#1F3F34]/5">
                <span className="material-symbols-outlined text-[14px]">carpenter</span>
                {job.industry || job.category}
              </span>
              <span className="px-4 py-1.5 bg-[#FACD15] text-[#1F3F34] rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                TrustVerified
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-[#1F3F34] leading-[0.95] tracking-tight bricolage">
              {job.title}
            </h1>
            
            <div className="flex items-center gap-2 text-[#1F3F34]/60 font-bold">
              <span className="material-symbols-outlined text-xl">location_on</span>
              <span>{job.location || job.address}</span>
            </div>
          </section>

          <section className="lg:hidden bg-white rounded-[24px] p-8 shadow-sm border-b-4 border-[#FACD15]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/50 mb-1">Projected Budget</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-[#1F3F34]">₹{Number(job.budget || job.salary || 0).toLocaleString()}</h2>
              <span className="text-[#1F3F34]/60 font-bold text-sm">Total Project</span>
            </div>
          </section>

          <div className="bg-white rounded-[24px] p-8 lg:p-10 shadow-sm border border-transparent transition-all hover:shadow-xl hover:shadow-[#1F3F34]/5 group relative overflow-hidden">
            <h3 className="text-2xl font-black mb-6 text-[#1F3F34] flex items-center gap-3 bricolage">
              <span className="hidden lg:block w-1.5 h-6 bg-[#FACD15] rounded-full group-hover:scale-y-110 transition-transform"></span>
              Scope of Work
            </h3>
            
            <div className="space-y-6 text-[#1F3F34] leading-relaxed relative z-10">
              <div className="text-xl font-bold leading-snug opacity-90 lg:opacity-100 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          </div>

          <div className="bg-[#1F3F34] text-[#F5F4EF] rounded-[24px] p-8 lg:p-10 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FACD15]/10 rounded-full blur-3xl transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-2 tracking-tight italic bricolage">Ready to start?</h3>
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
                
                <button 
                  onClick={handleApply}
                  className="w-full bg-[#FACD15] text-[#1F3F34] font-black text-sm lg:text-xl py-4 lg:py-6 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-[#FACD15]/10 uppercase tracking-widest"
                >
                  <span>Submit Application</span>
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-[24px] p-8 shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15]/5 rounded-bl-[100px] transition-all group-hover:scale-110" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#1F3F34]/60 mb-2">Project Allocation</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#1F3F34]">₹{Number(job.budget || job.salary || 0).toLocaleString()}</span>
              <span className="text-sm font-bold opacity-60">Total</span>
            </div>
          </div>

          <div className="bg-[#EFEEE9] rounded-[24px] p-8 flex items-center gap-6 group hover:bg-[#FACD15]/10 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#1F3F34] flex items-center justify-center text-[#FACD15] shadow-lg group-hover:rotate-3 transition-transform">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Client Status</p>
              <h4 className="text-lg font-black leading-tight text-[#1F3F34] truncate max-w-[180px]">
                {employer?.companyName || 'Verified Partner'}
              </h4>
            </div>
          </div>

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
                        <p className="text-xs text-[#414845] font-medium">{job.location || job.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#1F3F34]/40 bg-[#EFEEE9]">
                <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Location Data Missing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container {
            width: 100%;
            height: 100%;
            font-family: inherit;
        }
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
      `}</style>
    </div>
  );
}
