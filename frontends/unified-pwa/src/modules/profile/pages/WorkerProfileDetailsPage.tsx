import { useState, useRef } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { profileService, type WorkerProfile } from "../../../services/profile.service";
import { applicationService } from "../../../services/application.service";
import { queryKeys } from "../../../lib/queryKeys";
import { NotificationCenter } from '../../dashboard/components/NotificationCenter';
import { UserAvatar } from "../../../components/common/UserAvatar";
import { 
  ShieldCheck, 
  MapPin, 
  MapPinned, 
  Star, 
  History, 
  Camera, 
  Edit2, 
  CheckCircle2, 
  Zap, 
  Menu, 
  GraduationCap, 
  Languages, 
  Briefcase, 
  Calendar, 
  User as UserIcon, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText, 
  Download, 
  Sparkles,
  ExternalLink,
  Globe,
  Award,
  Check,
  Loader2,
  UploadCloud
} from "lucide-react";
import { EditWorkerProfileModal } from "../components/EditWorkerProfileModal";
import { CandidateResumeModal } from "../components/resume/CandidateResumeModal";
import type { ResumeData } from "../components/resume/CandidateResumeView";

export default function WorkerProfileDetailsPage() {
  const { user } = useUser();
  const { updateUser } = useAuth();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const setIsSidebarOpen = outletCtx?.setIsSidebarOpen || (() => {});
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploadingPhoto(true);
    setPhotoFeedback(null);

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
          // 1. Update backend
          await profileService.updateProfile({
            profileImageUrl: compressedDataUrl,
            profile_image_url: compressedDataUrl,
            profilePhoto: compressedDataUrl
          });

          // 2. Update Auth user state
          updateUser({
            ...user,
            profileImageUrl: compressedDataUrl,
            profile_image_url: compressedDataUrl
          });

          // 3. Update React Query Cache immediately
          queryClient.setQueryData(queryKeys.workers.detail('me'), (old: any) => ({
            ...(old || {}),
            profileImageUrl: compressedDataUrl,
            profile_image_url: compressedDataUrl,
            profilePhoto: compressedDataUrl
          }));
          queryClient.invalidateQueries({ queryKey: queryKeys.workers.detail('me') });

          setPhotoFeedback("Profile photo updated successfully!");
          setTimeout(() => setPhotoFeedback(null), 4000);
        } catch (err) {
          console.error("Failed to update photo:", err);
          alert("Failed to update profile photo. Please try again.");
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      img.onerror = () => {
        alert("Failed to process image file.");
        setIsUploadingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert("Failed to read file.");
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const { data: profile } = useQuery<WorkerProfile | null>({
    queryKey: queryKeys.workers.detail('me'),
    queryFn: profileService.getWorkerProfile,
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: queryKeys.jobs.myApplications,
    queryFn: applicationService.getMyApplications,
  });

  const handleUpdateGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Detecting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          let detectedCity = profile?.city || 'Local area';
          let detectedAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              const addr = geoData.address;
              detectedCity = addr.city || addr.town || addr.suburb || addr.state_district || detectedCity;
              detectedAddress = [addr.suburb || addr.neighbourhood, detectedCity].filter(Boolean).join(', ');
            }
          } catch {
            // fallback
          }

          await profileService.updateProfile({
            latitude,
            longitude,
            city: detectedCity,
            address: detectedAddress,
            location: detectedAddress,
          });

          queryClient.setQueryData(queryKeys.workers.detail('me'), (old: any) => ({
            ...(old || {}),
            latitude,
            longitude,
            city: detectedCity,
            address: detectedAddress,
            location: detectedAddress,
          }));

          setLocationStatus(`Live: ${detectedAddress}`);
        } catch (err: any) {
          console.error("GPS update error:", err);
          setLocationStatus("Failed to update profile location");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        setLocationStatus("GPS access denied");
        alert("Please enable location access in your browser settings to match nearby jobs.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isVerified = Boolean(user?.identityVerified || (user as any)?.isVerified || (profile as any)?.is_verified || (profile as any)?.isVerified);
  const completedJobsCount = (profile as any)?.completed_jobs || (profile as any)?.completedJobs || myApplications.filter((a: any) => a.status === 'ACCEPTED' || a.status === 'COMPLETED').length;
  const ratingDisplay = (profile as any)?.rating ? Number((profile as any).rating).toFixed(1) : (profile?.trustScore ? `${(profile.trustScore / 200).toFixed(1)}` : 'New');

  const formattedPhone = profile?.phoneNumber || user?.phoneNumber || 'Not provided';
  const displayEmail = profile?.email || user?.email || 'Not provided';
  const displayDob = profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const displayGender = profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase() : null;

  // Language mapping
  const englishLevelLabel = 
    profile?.englishProficiency === 'FLUENT' ? 'Fluent (Speak, Read & Write comfortably)' :
    profile?.englishProficiency === 'GOOD' ? 'Good (Can speak & understand well)' :
    profile?.englishProficiency === 'BASIC' ? 'Basic (Elementary greetings & terms)' :
    profile?.englishProficiency === 'NONE' ? 'No English' :
    profile?.englishProficiency || 'Basic English';

  // Resume builder data
  const resumeData: ResumeData = {
    fullName: profile?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Candidate',
    phoneNumber: formattedPhone !== 'Not provided' ? formattedPhone : '+91 98765 43210',
    email: displayEmail !== 'Not provided' ? displayEmail : 'candidate@trusthire.in',
    profileImageUrl: profile?.profileImageUrl 
      || profile?.profilePhoto 
      || (profile as any)?.profile_image_url 
      || user?.profileImageUrl 
      || user?.profile_image_url 
      || undefined,
    city: profile?.city || profile?.location || 'Chennai, India',
    area: profile?.area || profile?.address || '',
    highestEducation: profile?.highestEducation || 'Graduate / Diploma',
    isPursuingEducation: profile?.isPursuingEducation || false,
    collegeName: profile?.collegeName || '',
    degree: profile?.degree || '',
    specialization: profile?.specialization || '',
    schoolMedium: profile?.schoolMedium || '',
    englishProficiency: englishLevelLabel,
    languagesKnown: profile?.languagesKnown && profile.languagesKnown.length > 0 ? profile.languagesKnown : ['English', 'Tamil', 'Hindi'],
    preferredRoles: profile?.preferredRoles && profile.preferredRoles.length > 0 ? profile.preferredRoles : (profile?.skills?.split(',').filter(Boolean) || ['Technical Specialist']),
    skills: profile?.skills?.split(',').filter(Boolean) || ['Problem Solving', 'Customer Service'],
    experienceYears: profile?.experienceYears || 1,
    bio: profile?.bio || 'Dedicated professional with verified skills, strong work ethic, and quick learning capabilities.',
    dob: profile?.dob || '',
    gender: profile?.gender || '',
    isVerified: isVerified
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 space-y-6">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60 lg:border-none">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-[#0066FF] text-[11px] font-black rounded-full uppercase tracking-wider">
                Candidate Dossier
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Profile & Resume</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0A1931] tracking-tight">Worker Profile & Verified CV</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">Manage your identity, academic background, language skills, and downloadable CV.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsResumeModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <FileText className="w-4 h-4" /> View / Download CV
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold shadow-xs transition-all text-xs cursor-pointer whitespace-nowrap"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <Link 
              to="/onboarding"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all text-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Wizard
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: Identity, Contact & Location */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-bl-[100px]"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={photoInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div 
                  onClick={() => !isUploadingPhoto && photoInputRef.current?.click()}
                  title="Click to change profile photo"
                  className="relative mb-4 group cursor-pointer"
                >
                  <UserAvatar 
                    src={profile?.profileImageUrl || (profile as any)?.profile_image_url || (profile as any)?.profilePhoto || user?.profileImageUrl || (user as any)?.profile_image_url || (user as any)?.photoURL} 
                    name={profile?.fullName || user?.firstName} 
                    size="xl" 
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0066FF] hover:bg-[#0052cc] group-hover:scale-110 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-all">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {photoFeedback && (
                  <div className="mb-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{photoFeedback}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => !isUploadingPhoto && photoInputRef.current?.click()}
                  className="text-xs font-bold text-[#0066FF] hover:text-[#0052cc] flex items-center gap-1 mb-2 hover:underline cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? "Uploading..." : "Change Photo"}</span>
                </button>

                <h2 className="text-xl font-black text-[#0A1931]">{profile?.fullName || user?.firstName || 'Worker'}</h2>
                <p className="text-slate-500 font-bold text-xs mt-0.5 uppercase tracking-wide">
                  {profile?.preferredRoles?.[0] || profile?.skills?.split(',')[0] || 'Verified Specialist'}
                </p>

                <div className={`mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                  isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">{isVerified ? 'Aadhaar Verified' : 'Unverified Worker'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Jobs Done</p>
                  <p className="text-xl font-black text-[#0A1931] mt-1">{completedJobsCount}</p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Rating</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xl font-black text-[#0A1931]">{ratingDisplay}</span>
                    <Star className="w-4 h-4 text-[#FACD15] fill-[#FACD15]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal & Contact Dossier */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#0A1931] uppercase tracking-wider flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#0066FF]" /> Personal Dossier
              </h3>
              
              <div className="space-y-3 pt-2 text-xs">
                {displayDob && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth
                    </span>
                    <span className="font-bold text-slate-800">{displayDob}</span>
                  </div>
                )}

                {displayGender && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Gender
                    </span>
                    <span className="font-bold text-slate-800">{displayGender}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile (+91)
                  </span>
                  <span className="font-bold text-slate-800">{formattedPhone}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                  </span>
                  <span className="font-bold text-slate-800 truncate max-w-[160px]" title={displayEmail}>{displayEmail}</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Job Alerts
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    profile?.whatsappOptIn !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {profile?.whatsappOptIn !== false ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Relocation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <MapPinned className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A1931]">Work Location</h3>
                  <p className="text-xs text-slate-500 font-medium">Matching zone</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0066FF] mt-0.5 shrink-0" />
                <p className="text-sm font-semibold text-slate-700">
                  {profile?.address || profile?.city || profile?.location || 'Location not set'}
                </p>
              </div>
              {profile?.latitude && profile?.longitude && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  GPS Live ({profile.latitude.toFixed(2)}°, {profile.longitude.toFixed(2)}°)
                </p>
              )}
              {locationStatus && (
                <p className="text-xs font-semibold text-blue-600 mt-2">{locationStatus}</p>
              )}

              {/* Relocation info */}
              {profile?.willingToRelocate && (
                <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                  <p className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" /> Willing to relocate for work
                  </p>
                  {profile?.preferredCities && profile.preferredCities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {profile.preferredCities.map((city, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white rounded-md text-[11px] font-semibold text-blue-800 border border-blue-200">
                          {city}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleUpdateGPSLocation}
                disabled={isLocating}
                className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#0066FF] font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                {isLocating ? 'Detecting Location...' : 'Update GPS Location'}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: CV Featured Card, Education, Languages, Preferred Roles, Shifts */}
          <div className="lg:col-span-2 space-y-6">

            {/* TRUSTHYRE VERIFIED DIGITAL CV BANNER */}
            <div className="bg-linear-to-br from-[#0A1931] via-[#112347] to-[#0A1931] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#0066FF]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FACD15]" />
                    <span>Instant Candidate Resume Engine</span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-white">TrustHyre Verified Resume</h3>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-md">
                    Employers can view, verify, and download your comprehensive professional CV formatted according to standard recruitment standards.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="px-5 py-3 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" /> Preview CV
                  </button>
                  <button
                    onClick={() => {
                      setIsResumeModalOpen(true);
                      setTimeout(() => window.print(), 300);
                    }}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              </div>
            </div>

            {/* EDUCATION & ACADEMICS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#0066FF]" /> Education & Academics
                </h3>
                {profile?.highestEducation && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200/60">
                    {profile.highestEducation}
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qualification Level</span>
                  <p className="text-sm font-bold text-slate-900">
                    {profile?.highestEducation || 'High School / Secondary'}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-emerald-600">
                    {profile?.isPursuingEducation ? '• Currently Studying / Pursuing' : '• Completed'}
                  </span>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Degree / Field</span>
                  <p className="text-sm font-bold text-slate-900">
                    {profile?.degree || profile?.specialization || profile?.schoolMedium ? (
                      `${profile?.degree || ''} ${profile?.specialization ? `(${profile.specialization})` : ''} ${profile?.schoolMedium ? `- ${profile.schoolMedium}` : ''}`.trim()
                    ) : (
                      'General Academics'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {profile?.collegeName || 'Recognized Board / Institution'}
                  </p>
                </div>
              </div>
            </div>

            {/* LANGUAGES & COMMUNICATION MATRIX */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                <Languages className="w-5 h-5 text-[#0066FF]" /> Language Competencies
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                {/* English proficiency */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">English Proficiency</span>
                  <p className="text-sm font-black text-[#0A1931]">{englishLevelLabel}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Standard workplace communication readiness</p>
                </div>

                {/* Regional Languages */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Languages Known</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {profile?.languagesKnown && profile.languagesKnown.length > 0 ? (
                      profile.languagesKnown.map((lang, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white text-slate-800 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">English, Hindi, Tamil</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PREFERRED JOB ROLES & VERIFIED EXPERTISE */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#0066FF]" /> Target Roles & Verified Expertise
              </h3>
              
              <div className="space-y-3 pt-1">
                {profile?.preferredRoles && profile.preferredRoles.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Preferred Roles:</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferredRoles.map((role, idx) => (
                        <div 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs"
                        >
                          <Award className="w-3.5 h-3.5 text-blue-600" />
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Verified Skills & Tools:</span>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.split(',').filter(Boolean).map((skill, idx) => (
                      <div 
                        key={idx} 
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-bold text-xs shadow-2xs transition-all hover:bg-emerald-100/70"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{skill.trim()}</span>
                      </div>
                    )) || (
                      <div className="text-slate-500 text-xs font-medium">
                        No technical skills registered.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT JOB HISTORY */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#0A1931]" /> Job Application History
                </h3>
                <Link to="/applied-jobs" className="text-xs font-bold text-[#0066FF] hover:underline">View All</Link>
              </div>
              
              <div className="divide-y divide-slate-100">
                {myApplications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-[#0A1931]">No job history yet</p>
                    <p className="text-xs text-slate-500 mt-1">Browse available openings to start working and earning.</p>
                    <Link to="/search" className="inline-block mt-4 px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-xl hover:bg-blue-700">
                      Find Jobs
                    </Link>
                  </div>
                ) : (
                  myApplications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-[#0066FF] shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0A1931]">{app.job?.title || app.jobTitle || 'Job Role'}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {app.job?.location || app.job?.city || 'Local area'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                        <span className="font-black text-emerald-600">₹{app.job?.budget?.toLocaleString() || 'Negotiated'}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${
                          app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* QUICK EDIT MODAL */}
      <EditWorkerProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile || undefined}
      />

      {/* CANDIDATE VERIFIED RESUME MODAL */}
      <CandidateResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        data={resumeData}
      />
    </div>
  );
}
