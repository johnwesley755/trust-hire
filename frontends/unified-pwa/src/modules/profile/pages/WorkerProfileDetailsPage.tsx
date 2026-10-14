import { useState, useRef } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { profileService, type WorkerProfile } from "../../../services/profile.service";
import { applicationService } from "../../../services/application.service";
import { queryKeys } from "../../../lib/queryKeys";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { AppLoader } from "../../../components/common/AppLoader";
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
  Globe,
  Award,
  Loader2,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  Check
} from "lucide-react";
import { EditWorkerProfileModal } from "../components/EditWorkerProfileModal";
import { CandidateResumeModal } from "../components/resume/CandidateResumeModal";
import type { ResumeData } from "../components/resume/CandidateResumeView";

export default function WorkerProfileDetailsPage() {
  const { user } = useUser();
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'academics' | 'skills' | 'applications' | 'about'>('academics');
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoFeedback("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      setTimeout(() => setPhotoFeedback(null), 4000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoFeedback("Image file is too large (maximum 10MB).");
      setTimeout(() => setPhotoFeedback(null), 4000);
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
          setPhotoFeedback("Failed to update profile photo. Please try again.");
          setTimeout(() => setPhotoFeedback(null), 4000);
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      img.onerror = () => {
        setPhotoFeedback("Failed to process image file.");
        setIsUploadingPhoto(false);
        setTimeout(() => setPhotoFeedback(null), 4000);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setPhotoFeedback("Failed to read file.");
      setIsUploadingPhoto(false);
      setTimeout(() => setPhotoFeedback(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const { data: profile, isLoading: isProfileLoading } = useQuery<WorkerProfile | null>({
    queryKey: queryKeys.workers.detail('me'),
    queryFn: profileService.getWorkerProfile,
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: queryKeys.jobs.myApplications,
    queryFn: applicationService.getMyApplications,
  });

  const handleUpdateGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      setTimeout(() => setLocationStatus(null), 4000);
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

          setLocationStatus(`Live GPS: ${detectedAddress}`);
          setTimeout(() => setLocationStatus(null), 5000);
        } catch (err: any) {
          console.error("GPS update error:", err);
          setLocationStatus("Failed to update profile location");
          setTimeout(() => setLocationStatus(null), 4000);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        setLocationStatus("GPS access denied. Enable location in browser settings.");
        setTimeout(() => setLocationStatus(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (isProfileLoading && !profile) {
    return (
      <div className="w-full min-h-screen p-2 sm:p-3 bg-white font-['Onest',system-ui,sans-serif] flex items-center justify-center">
        <AppLoader variant="page" message="Loading verified worker profile..." />
      </div>
    );
  }

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
    phoneNumber: formattedPhone !== 'Not provided' ? formattedPhone : undefined,
    email: displayEmail !== 'Not provided' ? displayEmail : undefined,
    profileImageUrl: profile?.profileImageUrl 
      || profile?.profilePhoto 
      || (profile as any)?.profile_image_url 
      || user?.profileImageUrl 
      || user?.profile_image_url 
      || undefined,
    city: profile?.city || profile?.location || undefined,
    area: profile?.area || profile?.address || '',
    highestEducation: profile?.highestEducation || undefined,
    isPursuingEducation: profile?.isPursuingEducation || false,
    collegeName: profile?.collegeName || '',
    degree: profile?.degree || '',
    specialization: profile?.specialization || '',
    schoolMedium: profile?.schoolMedium || '',
    englishProficiency: englishLevelLabel,
    languagesKnown: profile?.languagesKnown && profile.languagesKnown.length > 0 ? profile.languagesKnown : [],
    preferredRoles: profile?.preferredRoles && profile.preferredRoles.length > 0 ? profile.preferredRoles : (profile?.skills ? profile.skills.split(',').filter(Boolean) : []),
    skills: profile?.skills ? profile.skills.split(',').filter(Boolean) : [],
    experienceYears: profile?.experienceYears || 0,
    bio: profile?.bio || undefined,
    dob: profile?.dob || '',
    gender: profile?.gender || '',
    isVerified: isVerified
  };

  const currentTrade = profile?.preferredRoles?.[0] || (profile?.skills ? profile.skills.split(',')[0] : 'Specialist Candidate');

  return (
    <div className="w-full min-h-screen p-2 sm:p-3 bg-white font-['Onest',system-ui,sans-serif] text-[#0a0a0a]">
      <main className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* 1. HERO PROFILE CARD (Landing Page Aesthetic) */}
        <div className="bg-[#f4f4f4] rounded-[2rem] p-6 sm:p-8 border border-[#e6e8ec] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Identity & Avatar Cluster */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              
              {/* Photo Input & Avatar */}
              <div className="relative shrink-0">
                <input 
                  type="file" 
                  ref={photoInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div 
                  onClick={() => !isUploadingPhoto && photoInputRef.current?.click()}
                  title="Click to update photo"
                  className="relative group cursor-pointer"
                >
                  <UserAvatar 
                    src={profile?.profileImageUrl || (profile as any)?.profile_image_url || (profile as any)?.profilePhoto || user?.profileImageUrl || (user as any)?.profile_image_url || (user as any)?.photoURL} 
                    name={profile?.fullName || user?.firstName} 
                    size="xl" 
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0f2f63] hover:bg-[#2563c9] group-hover:scale-110 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-all">
                    {isUploadingPhoto ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Name, Trade, Badges */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0a0a0a]">
                    {profile?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Candidate Profile'}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    isVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-[#e6e8ec] text-[#717784]'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isVerified ? 'Biometric Verified' : 'Pending Verification'}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#717784]">
                  <span className="px-3 py-1 bg-[#0f2f63]/5 text-[#0f2f63] border border-[#0f2f63]/10 rounded-full font-semibold">
                    {currentTrade}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0f2f63]" />
                    <span>{profile?.city || profile?.location || 'Local Matching Area'}</span>
                  </span>
                  <span>•</span>
                  <span>{profile?.experienceYears || 1}+ Years Experience</span>
                </div>

                {photoFeedback && (
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{photoFeedback}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Action Buttons Cluster */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full lg:w-auto">
              <button 
                onClick={() => setIsResumeModalOpen(true)}
                className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f2f63] hover:bg-[#2563c9] text-white rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer active:scale-95 uppercase"
              >
                <FileText className="w-4 h-4" />
                <span>View & Download CV</span>
              </button>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-[#e6e8ec] text-[#0a0a0a] rounded-full font-medium text-xs shadow-2xs transition-all cursor-pointer uppercase active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#717784]" />
                <span>Edit Profile</span>
              </button>
              <Link 
                to="/onboarding"
                className="col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-[#e6e8ec] text-[#0a0a0a] rounded-full font-medium text-xs shadow-2xs transition-all cursor-pointer uppercase active:scale-95"
                title="Rerun onboarding wizard"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Wizard</span>
              </Link>
            </div>

          </div>
        </div>

        {/* 2. HALLMARK TRUST PROOF RIBBON */}
        <div className="bg-[#fbfbfb] rounded-[1.5rem] p-3 sm:p-4 border border-[#e6e8ec] shadow-2xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#e6e8ec]/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <span className="font-medium text-[#0a0a0a] truncate">Biometric ID Checked</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#e6e8ec]/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <span className="font-medium text-[#0a0a0a] truncate">Trade Skills Certified</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#e6e8ec]/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <span className="font-medium text-[#0a0a0a] truncate">Escrow Wage Protected</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#e6e8ec]/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <span className="font-medium text-[#0a0a0a] truncate">100% On-Time Record</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN 2-COLUMN DOSSIER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (4 Cols): Official Contact, Trust Tier & Quick Stats (order-2 on mobile so tabs are immediately visible) */}
          <div className="col-span-1 lg:col-span-4 space-y-6 order-2 lg:order-1">
            
            {/* Trust Level Tier Progression Card */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f2f63]" />
                  <h3 className="text-xs font-bold uppercase text-[#717784]">
                    Trust Progression
                  </h3>
                </div>
                <Link to="/level" className="text-xs font-semibold text-[#0f2f63] hover:underline flex items-center gap-1">
                  <span>Level Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white p-4 rounded-[1.25rem] border border-[#e6e8ec] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0a0a0a]">
                    Level 2: Verified Specialist
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Tier 2
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#f4f4f4] h-2 rounded-full overflow-hidden border border-[#e6e8ec]">
                  <div className="bg-[#0f2f63] h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-[11px] text-[#717784] font-medium leading-relaxed">
                  Complete 2 more verified shifts or pass a trade test to unlock Level 3 direct wage premiums.
                </p>
              </div>

              {/* Quick Metrics 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3.5 rounded-2xl border border-[#e6e8ec] text-center">
                  <p className="text-[10px] font-bold uppercase text-[#717784]">Completed</p>
                  <p className="text-xl font-bold text-[#0a0a0a] mt-0.5">{completedJobsCount}</p>
                  <p className="text-[10px] text-[#717784]">shifts</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#e6e8ec] text-center">
                  <p className="text-[10px] font-bold uppercase text-[#717784]">Rating</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-xl font-bold text-[#0a0a0a]">{ratingDisplay}</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-[10px] text-[#717784]">average</p>
                </div>
              </div>
            </div>

            {/* Official Contact & Identification Card */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6e8ec]">
                <UserIcon className="w-4 h-4 text-[#0f2f63]" />
                <h3 className="text-xs font-bold uppercase text-[#717784]">
                  Contact & Dossier Details
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#e6e8ec]">
                  <span className="text-[#717784] font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0f2f63]" /> Phone
                  </span>
                  <span className="font-bold text-[#0a0a0a]">{formattedPhone}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#e6e8ec]">
                  <span className="text-[#717784] font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0f2f63]" /> Email
                  </span>
                  <span className="font-bold text-[#0a0a0a] truncate max-w-[150px]" title={displayEmail}>
                    {displayEmail}
                  </span>
                </div>

                {displayDob && (
                  <div className="flex items-center justify-between py-1 border-b border-[#e6e8ec]">
                    <span className="text-[#717784] font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0f2f63]" /> Date of Birth
                    </span>
                    <span className="font-bold text-[#0a0a0a]">{displayDob}</span>
                  </div>
                )}

                {displayGender && (
                  <div className="flex items-center justify-between py-1 border-b border-[#e6e8ec]">
                    <span className="text-[#717784] font-medium flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-[#0f2f63]" /> Gender
                    </span>
                    <span className="font-bold text-[#0a0a0a]">{displayGender}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#717784] font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Alerts
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    profile?.whatsappOptIn !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {profile?.whatsappOptIn !== false ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Work Zone & Live Location Card */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e6e8ec]">
                <MapPinned className="w-4 h-4 text-[#0f2f63]" />
                <h3 className="text-xs font-bold uppercase text-[#717784]">
                  Operational Zone & GPS
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#0f2f63] mt-0.5 shrink-0" />
                  <p className="font-semibold text-[#0a0a0a]">
                    {profile?.address || profile?.city || profile?.location || 'Location not specified'}
                  </p>
                </div>

                {profile?.latitude && profile?.longitude && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Coordinates: ({profile.latitude.toFixed(2)}°, {profile.longitude.toFixed(2)}°)
                  </p>
                )}

                {locationStatus && (
                  <p className="text-xs font-semibold text-[#0f2f63] bg-white p-2 rounded-lg border border-[#e6e8ec]">
                    {locationStatus}
                  </p>
                )}

                {profile?.willingToRelocate && (
                  <div className="p-3 bg-white rounded-xl border border-[#e6e8ec] text-xs space-y-1">
                    <p className="font-bold text-[#0a0a0a] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#0f2f63]" /> Willing to relocate for work
                    </p>
                    {profile?.preferredCities && profile.preferredCities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {profile.preferredCities.map((city, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#f4f4f4] rounded text-[10px] font-semibold text-[#0a0a0a] border border-[#e6e8ec]">
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
                  className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#0f2f63] font-medium text-xs rounded-full border border-[#e6e8ec] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase active:scale-95 shadow-2xs mt-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isLocating ? 'Detecting Location...' : 'Update Live Location'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (8 Cols): Tabbed Dossier Sections (order-1 on mobile so main tabs are immediately visible) */}
          <div className="col-span-1 lg:col-span-8 space-y-6 order-1 lg:order-2">
            
            {/* Pill Tab Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'academics', label: 'Academic & Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills & Trade Certs', icon: Award },
                { id: 'applications', label: 'Application History', icon: History },
                { id: 'about', label: 'Bio & Background', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f2f63] text-white shadow-xs'
                        : 'bg-[#f4f4f4] hover:bg-[#e6e8ec] text-[#0a0a0a] border border-[#e6e8ec]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: Academics */}
            {activeTab === 'academics' && (
              <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 sm:p-7 border border-[#e6e8ec] space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#e6e8ec]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0f2f63]" />
                    <h3 className="text-sm font-bold text-[#0a0a0a]">
                      Educational Credentials & Academics
                    </h3>
                  </div>
                  {profile?.highestEducation && (
                    <span className="px-3 py-1 bg-white text-[#0f2f63] text-xs font-semibold rounded-full border border-[#e6e8ec]">
                      {profile.highestEducation}
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                    <span className="text-[10px] font-bold text-[#717784] uppercase">Highest Qualification</span>
                    <p className="text-sm font-bold text-[#0a0a0a]">
                      {profile?.highestEducation || 'High School / Secondary'}
                    </p>
                    <span className="inline-block text-[11px] font-semibold text-emerald-700">
                      {profile?.isPursuingEducation ? '• Currently Studying / Pursuing' : '• Completed & Verified'}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                    <span className="text-[10px] font-bold text-[#717784] uppercase">Degree / Specialization</span>
                    <p className="text-sm font-bold text-[#0a0a0a]">
                      {profile?.degree || profile?.specialization || profile?.schoolMedium ? (
                        `${profile?.degree || ''} ${profile?.specialization ? `(${profile.specialization})` : ''} ${profile?.schoolMedium ? `- ${profile.schoolMedium}` : ''}`.trim()
                      ) : (
                        'Standard Secondary Education'
                      )}
                    </p>
                    <p className="text-[11px] text-[#717784] font-medium">
                      {profile?.collegeName || 'Recognized Board / Technical Institute'}
                    </p>
                  </div>
                </div>

                {/* Language Matrix */}
                <div className="pt-2 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#717784] flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-[#0f2f63]" /> Language Matrix
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                      <span className="text-[10px] font-bold text-[#717784] uppercase">English Competency</span>
                      <p className="text-sm font-bold text-[#0a0a0a]">{englishLevelLabel}</p>
                      <p className="text-[11px] text-[#717784]">Standard workplace communication ready</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                      <span className="text-[10px] font-bold text-[#717784] uppercase">Other Languages Known</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile?.languagesKnown && profile.languagesKnown.length > 0 ? (
                          profile.languagesKnown.map((lang, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-[#f4f4f4] text-[#0a0a0a] text-xs font-semibold rounded-lg border border-[#e6e8ec]">
                              {lang}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#717784] font-medium">English, Tamil, Hindi</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Skills & Certifications */}
            {activeTab === 'skills' && (
              <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 sm:p-7 border border-[#e6e8ec] space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[#e6e8ec]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#0f2f63]" />
                    <h3 className="text-sm font-bold text-[#0a0a0a]">
                      Verified Trade Skills & Certifications
                    </h3>
                  </div>
                  <Link
                    to="/tests"
                    className="text-xs font-semibold text-[#0f2f63] hover:underline flex items-center gap-1"
                  >
                    <span>Take Skill Test</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {/* Preferred Roles */}
                  {profile?.preferredRoles && profile.preferredRoles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#717784] uppercase">Primary Target Trades:</span>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredRoles.map((role, idx) => (
                          <div 
                            key={idx} 
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e6e8ec] text-[#0a0a0a] font-semibold text-xs shadow-2xs"
                          >
                            <Award className="w-3.5 h-3.5 text-[#0f2f63]" />
                            <span>{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registered Skills */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#717784] uppercase">Verified Competencies:</span>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills?.split(',').filter(Boolean).map((skill, idx) => (
                        <div 
                          key={idx} 
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#e6e8ec] text-[#0a0a0a] font-semibold text-xs shadow-2xs hover:border-[#0f2f63]/40 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{skill.trim()}</span>
                        </div>
                      )) || (
                        <div className="text-[#717784] text-xs font-medium">
                          No competencies registered. Update your profile to add skills.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Applications */}
            {activeTab === 'applications' && (
              <div className="bg-[#f4f4f4] rounded-[1.75rem] border border-[#e6e8ec] overflow-hidden animate-in fade-in duration-150">
                <div className="p-6 border-b border-[#e6e8ec] flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#0f2f63]" />
                    <h3 className="text-sm font-bold text-[#0a0a0a]">
                      Recent Job Applications & Status
                    </h3>
                  </div>
                  <Link to="/applied-jobs" className="text-xs font-semibold text-[#0f2f63] hover:underline flex items-center gap-1">
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-[#e6e8ec]">
                  {myApplications.length === 0 ? (
                    <div className="p-10 text-center space-y-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#717784] border border-[#e6e8ec]">
                        <Briefcase className="w-6 h-6 text-[#0f2f63]" />
                      </div>
                      <h4 className="text-sm font-bold text-[#0a0a0a]">No job applications yet</h4>
                      <p className="text-xs text-[#717784] max-w-sm mx-auto">
                        Explore verified openings matching your skills to start working and earning on-time payouts.
                      </p>
                      <Link 
                        to="/search" 
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f2f63] hover:bg-[#2563c9] text-white text-xs font-medium rounded-full uppercase shadow-xs transition-all active:scale-95"
                      >
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    myApplications.slice(0, 5).map((app: any) => (
                      <div key={app.id} className="p-4 sm:p-5 bg-white hover:bg-[#fbfbfb] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex gap-3.5 items-center">
                          <div className="w-10 h-10 rounded-xl bg-[#f4f4f4] border border-[#e6e8ec] flex items-center justify-center font-bold text-[#0f2f63] shrink-0">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#0a0a0a]">
                              {app.job?.title || app.jobTitle || 'Job Role'}
                            </h4>
                            <p className="text-[11px] text-[#717784] mt-0.5">
                              {app.job?.location || app.job?.city || 'Local area'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                          <span className="font-bold text-emerald-700 text-xs">
                            ₹{app.job?.budget?.toLocaleString() || 'Negotiated'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-1 border ${
                            app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            app.status === 'REJECTED' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                            'bg-[#f4f4f4] text-[#0a0a0a] border-[#e6e8ec]'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: About / Bio */}
            {activeTab === 'about' && (
              <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 sm:p-7 border border-[#e6e8ec] space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-3 border-b border-[#e6e8ec]">
                  <FileText className="w-4 h-4 text-[#0f2f63]" />
                  <h3 className="text-sm font-bold text-[#0a0a0a]">
                    Professional Summary & Bio
                  </h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e6e8ec] text-xs text-[#0a0a0a] leading-relaxed">
                  <p>{profile?.bio || 'Dedicated professional with verified skills, strong work ethic, and quick learning capabilities. Committed to punctual delivery, clean trade standards, and reliable attendance across client assignments.'}</p>
                </div>
              </div>
            )}

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

