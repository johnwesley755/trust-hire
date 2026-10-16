import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workerService } from '../../../services/worker.service';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { queryKeys } from '../../../lib/queryKeys';
import { useSavedStore } from '../../../hooks/useSavedStore';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  ChevronLeft, 
  Loader2, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Zap, 
  MapPin,
  Mail,
  Phone,
  Briefcase,
  FileText,
  X,
  GraduationCap,
  Languages,
  Calendar,
  User as UserIcon,
  Globe,
  Award,
  Sparkles,
  Download,
  MessageSquare,
  Check,
  Send,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { AppLoader } from '../../../components/common/AppLoader';
import { CandidateResumeModal } from '../../profile/components/resume/CandidateResumeModal';
import type { ResumeData } from '../../profile/components/resume/CandidateResumeView';

export const WorkerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isWorkerSaved, toggleSaveWorker } = useSavedStore();

  const { data: employerStatusData } = useQuery({
    queryKey: queryKeys.employer.workerStatus(id || ''),
    queryFn: () => applicationService.getEmployerWorkerStatus(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const existingApplications = employerStatusData?.applications || [];
  const applicationsByJobId = new Map(existingApplications.map((app: any) => [app.jobId, app]));

  const { data: myJobs = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: queryKeys.jobs.employerJobs,
    queryFn: () => jobService.getMyJobs(),
    enabled: isModalOpen,
    staleTime: 1000 * 60 * 3,
  });

  const dispatchOfferMutation = useMutation({
    mutationFn: (jobId: string) => applicationService.dispatchOffer({ jobId, workerId: id || '' }),
    onSuccess: () => {
      setErrorMessage(null);
      setIsModalOpen(false);
      setSelectedJobId('');
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.employer.workerStatus(id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.workers.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success('Job offer sent successfully!');
    },
    onError: (err: any) => {
      setErrorMessage(err?.response?.data?.message || err?.message || 'Failed to send offer.');
    }
  });

  const handleDispatchOffer = () => {
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleConfirmOffer = () => {
    if (selectedJobId) {
      dispatchOfferMutation.mutate(selectedJobId);
    }
  };

  useEffect(() => {
    if (id) {
      workerService.incrementProfileView(id).catch(() => {});
    }
  }, [id]);

  const { data: worker, isLoading: isLoadingWorker } = useQuery({
    queryKey: queryKeys.workers.detail(id || ''),
    queryFn: () => workerService.getWorkerById(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const isSaved = isWorkerSaved(worker?.userId || id || '');

  const handleShare = async () => {
    const shareData = {
      title: `${worker?.name || 'Worker Specialist'} - TrustHyre Profile`,
      text: `Check out ${worker?.name || 'this candidate'}'s verified profile on TrustHyre`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Worker profile link copied to clipboard!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Worker profile link copied to clipboard!');
      }
    }
  };

  const handleToggleSave = () => {
    if (!worker && !id) return;
    toggleSaveWorker({
      userId: worker?.userId || id || '',
      name: worker?.name || 'Specialist',
      profilePhoto: worker?.profilePhoto,
      skills: worker?.skills || [],
      city: worker?.city || worker?.location || 'Local Area',
      location: worker?.location || worker?.city || 'Local Area',
      experience: worker?.experience || 0,
      trustScore: worker?.trustScore || 85,
      isVerified: worker?.verificationStatus === 'VERIFIED',
      bio: worker?.bio,
    });
  };

  if (isLoadingWorker) return <AppLoader variant="page" message="Loading Profile..." />;

  const w = worker as any;
  const isVerified = Boolean(worker?.verificationStatus === 'VERIFIED' || w?.isVerified || w?.is_verified);
  const displayDob = w?.dob ? new Date(w.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const displayGender = w?.gender ? w.gender.charAt(0).toUpperCase() + w.gender.slice(1).toLowerCase() : null;

  const englishLevelLabel = 
    w?.englishProficiency === 'FLUENT' ? 'Fluent (Speak, Read & Write)' :
    w?.englishProficiency === 'GOOD' ? 'Good (Conversational)' :
    w?.englishProficiency === 'BASIC' ? 'Basic' :
    w?.englishProficiency === 'NONE' ? 'No English' :
    w?.englishProficiency || 'Basic English';

  const resumeData: ResumeData = {
    fullName: worker?.name || 'Candidate',
    phoneNumber: worker?.phoneNumber || w?.phone_number || undefined,
    email: worker?.email || undefined,
    profileImageUrl: worker?.profilePhoto || (worker as any)?.profileImageUrl || (worker as any)?.profile_image_url || w?.profilePhoto || w?.profileImageUrl || w?.profile_image_url || undefined,
    city: worker?.city || worker?.location || undefined,
    area: w?.area || worker?.address || '',
    location: worker?.address || worker?.location,
    bio: worker?.bio || undefined,
    highestEducation: w?.highestEducation || w?.highest_education || undefined,
    isPursuingEducation: Boolean(w?.isPursuingEducation || w?.is_pursuing_education),
    collegeName: w?.collegeName || w?.college_name || '',
    degree: w?.degree || '',
    specialization: w?.specialization || '',
    schoolMedium: w?.schoolMedium || w?.school_medium || '',
    englishProficiency: englishLevelLabel,
    languagesKnown: w?.languagesKnown && w.languagesKnown.length > 0 ? w.languagesKnown : [],
    skills: worker?.skills && worker.skills.length > 0 ? worker.skills : [],
    preferredRoles: w?.preferredRoles && w.preferredRoles.length > 0 ? w.preferredRoles : (worker?.skills || []),
    preferredCities: w?.preferredCities || w?.preferred_cities || [],
    willingToRelocate: Boolean(w?.willingToRelocate || w?.willing_to_relocate),
    trustScore: worker?.trustScore,
    level: String(worker?.level || 'L1'),
    isVerified: isVerified,
    dob: w?.dob || '',
    gender: w?.gender || '',
  };

  const currentTrade = w?.preferredRoles?.[0] || worker?.skills?.[0] || 'Verified Specialist';

  return (
    <div className="w-full min-h-screen p-2 sm:p-3 bg-white font-['Onest',system-ui,sans-serif] text-[#0a0a0a]">
      <main className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#717784] hover:text-[#0a0a0a] transition-colors cursor-pointer self-start py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Candidate Directory</span>
          </button>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button 
              onClick={() => setIsResumeModalOpen(true)}
              className="px-4 py-2 bg-[#0f2f63] hover:bg-[#2563c9] text-white rounded-full text-xs font-medium uppercase shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View CV</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-2 bg-white rounded-full shadow-2xs border border-[#e6e8ec] hover:bg-[#f4f4f4] transition-all text-[#717784] hover:text-[#0a0a0a] cursor-pointer flex items-center gap-1 text-xs font-medium"
              title="Share Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleToggleSave}
              className={`p-2 rounded-full shadow-2xs border transition-all cursor-pointer flex items-center gap-1 text-xs font-medium ${
                isSaved 
                  ? 'bg-[#0f2f63]/10 border-[#0f2f63]/20 text-[#0f2f63]' 
                  : 'bg-white border-[#e6e8ec] text-[#717784] hover:bg-[#f4f4f4] hover:text-[#0a0a0a]'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Profile'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. HERO PROFILE CARD */}
        <div className="bg-[#f4f4f4] rounded-[2rem] p-6 sm:p-8 border border-[#e6e8ec] relative overflow-hidden shadow-xs">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Identity & Avatar Cluster */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
              <div className="shrink-0 relative">
                <UserAvatar 
                  src={worker?.profilePhoto || (worker as any)?.profileImageUrl || (worker as any)?.profile_image_url} 
                  name={worker?.name || 'Worker'} 
                  size="xl" 
                />
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a0a0a]">
                    {worker?.name || 'Candidate Specialist'}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    isVerified 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-[#e6e8ec] text-[#717784]'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 
                    <span>{isVerified ? 'Biometric Verified' : 'Pending Verification'}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#717784]">
                  <span className="px-3 py-1 bg-[#0f2f63]/10 text-[#0f2f63] rounded-full font-semibold">
                    {currentTrade}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0f2f63]" />
                    <span>{worker?.city || worker?.location || 'Local Matching Area'}</span>
                  </span>
                  <span>•</span>
                  <span>{worker?.experience || 0}+ Years Experience</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{worker?.availability === 'AVAILABLE' ? 'Available for Direct Hire' : 'Active on Shift'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Cluster (Responsive Grid on Mobile) */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full lg:w-auto">
              {(() => {
                const hasApproved = existingApplications.some((a: any) => a.status === 'ACCEPTED' || a.status === 'APPROVED');
                const hasOfferSent = existingApplications.some((a: any) => a.status === 'OFFER_SENT');
                const hasDeclined = existingApplications.length > 0 && existingApplications.every((a: any) => a.status === 'REJECTED' || a.status === 'DECLINED');

                return (
                  <button 
                    onClick={handleDispatchOffer}
                    className={`col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white rounded-full font-medium text-xs shadow-xs transition-all whitespace-nowrap cursor-pointer active:scale-95 uppercase ${
                      hasApproved
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : hasOfferSent
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : hasDeclined
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-[#0f2f63] hover:bg-[#2563c9]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {hasApproved 
                        ? 'Hired for Job' 
                        : hasOfferSent 
                        ? 'Offer Sent' 
                        : hasDeclined 
                        ? 'Offer Declined' 
                        : 'Send Job Offer'}
                    </span>
                  </button>
                );
              })()}

              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="col-span-2 sm:col-span-1 px-5 py-2.5 bg-white hover:bg-slate-50 border border-[#e6e8ec] text-[#0a0a0a] rounded-full font-medium text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-[#717784]" /> 
                <span>View Digital CV</span>
              </button>
            </div>

          </div>
        </div>

        {/* 3. MAIN 2-COLUMN DOSSIER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* RIGHT COLUMN (8 Cols): Academic, Languages & Skills (order-1 on mobile so qualifications are immediately visible) */}
          <div className="col-span-1 lg:col-span-8 space-y-6 order-1 lg:order-2">
            
            {/* Academic & Education Background */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase text-[#0a0a0a] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#0f2f63]" /> 
                  <span>Academic Background & Education</span>
                </h3>
                {w?.highestEducation && (
                  <span className="px-3 py-1 bg-white text-[#0f2f63] text-xs font-semibold rounded-full border border-[#e6e8ec]">
                    {w.highestEducation}
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                  <span className="text-[10px] font-bold text-[#717784] uppercase">Highest Qualification</span>
                  <p className="text-xs font-bold text-[#0a0a0a]">
                    {w?.highestEducation || 'Graduate / Diploma'}
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-emerald-600">
                    {w?.isPursuingEducation ? '• Currently Studying / Enrolled' : '• Course Completed'}
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                  <span className="text-[10px] font-bold text-[#717784] uppercase">Degree & Specialization</span>
                  <p className="text-xs font-bold text-[#0a0a0a]">
                    {w?.degree || w?.specialization || w?.schoolMedium ? (
                      `${w?.degree || ''} ${w?.specialization ? `(${w.specialization})` : ''} ${w?.schoolMedium ? `- ${w.schoolMedium}` : ''}`.trim()
                    ) : (
                      'General Curriculum'
                    )}
                  </p>
                  <p className="text-[11px] text-[#717784] font-medium">
                    {w?.collegeName || 'Recognized Institution / University'}
                  </p>
                </div>
              </div>
            </div>

            {/* Language Competencies */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-[#0a0a0a] flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#0f2f63]" /> 
                <span>Language Competencies</span>
              </h3>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                  <span className="text-[10px] font-bold text-[#717784] uppercase">English Proficiency</span>
                  <p className="text-xs font-bold text-[#0a0a0a]">{englishLevelLabel}</p>
                  <p className="text-[11px] text-[#717784]">Workplace communication readiness</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#e6e8ec] space-y-1">
                  <span className="text-[10px] font-bold text-[#717784] uppercase">Languages Spoken</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {w?.languagesKnown && w.languagesKnown.length > 0 ? (
                      w.languagesKnown.map((lang: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-[#f4f4f4] text-[#0a0a0a] text-xs font-medium rounded-full border border-[#e6e8ec]">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#717784]">English, Hindi, Tamil</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Target Job Roles & Skills */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-[#0a0a0a] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0f2f63]" /> 
                <span>Target Job Roles & Verified Skills</span>
              </h3>
              
              <div className="space-y-4 pt-1">
                {w?.preferredRoles && w.preferredRoles.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-[#717784] block mb-2">Preferred Roles:</span>
                    <div className="flex flex-wrap gap-2">
                      {w.preferredRoles.map((role: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e8ec] text-[#0f2f63] font-semibold text-xs shadow-2xs"
                        >
                          <Award className="w-3.5 h-3.5 text-[#0f2f63]" />
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-[#717784] block mb-2">Verified Technical Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {worker?.skills && worker.skills.length > 0 ? (
                      worker.skills.map((skill, idx) => (
                        <div 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e6e8ec] text-[#0a0a0a] font-medium text-xs shadow-2xs hover:border-[#0f2f63]/40 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{skill.trim()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#717784] italic text-xs">No specialized skills listed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary / Bio */}
            {worker?.bio && (
              <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-3">
                <h3 className="text-sm font-extrabold uppercase text-[#0a0a0a]">Professional Summary</h3>
                <p className="text-[#0a0a0a] text-xs sm:text-sm font-normal leading-relaxed bg-white p-4 rounded-2xl border border-[#e6e8ec]">
                  {worker.bio}
                </p>
              </div>
            )}

          </div>

          {/* LEFT COLUMN (4 Cols): Recruiter Dossier, Contact, Location (order-2 on mobile) */}
          <div className="col-span-1 lg:col-span-4 space-y-6 order-2 lg:order-1">
            
            {/* Recruiter Verified Resume Card */}
            <div className="rounded-[1.75rem] border border-[#e6e8ec] bg-[#f4f4f4] p-6 shadow-xs space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2f63]/10 text-[#0f2f63] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Worker Resume</span>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#0a0a0a]">Standard Formatted CV</h4>
                <p className="text-[#717784] text-xs mt-1 leading-relaxed">
                  View or download this worker's complete verified profile and work documents.
                </p>
              </div>

              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#0f2f63] hover:bg-[#2563c9] text-white text-xs font-medium uppercase flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Verified CV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsResumeModalOpen(true);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-50 text-[#0a0a0a] text-xs font-medium uppercase flex items-center justify-center gap-2 border border-[#e6e8ec] transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Candidate Personal Contact Dossier */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase text-[#717784] flex items-center gap-2 pb-2 border-b border-[#e6e8ec]">
                <UserIcon className="w-4 h-4 text-[#0f2f63]" /> 
                <span>Contact & Personal Details</span>
              </h3>
              
              <div className="space-y-3 text-xs">
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

                <div className="flex items-center justify-between py-1 border-b border-[#e6e8ec]">
                  <span className="text-[#717784] font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0f2f63]" /> Phone
                  </span>
                  <span className="font-bold text-[#0a0a0a]">
                    {worker?.phoneNumber || 'Disclosed on Hire'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#e6e8ec]">
                  <span className="text-[#717784] font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0f2f63]" /> Email
                  </span>
                  <span className="font-bold text-[#0a0a0a] truncate max-w-[150px]" title={worker?.email}>
                    {worker?.email || 'Registered Email'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#717784] font-medium flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Direct
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    w?.whatsappOptIn !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {w?.whatsappOptIn !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Mobility Card */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase text-[#717784] flex items-center gap-2 pb-2 border-b border-[#e6e8ec]">
                <MapPin className="w-4 h-4 text-[#0f2f63]" /> 
                <span>Location & Mobility</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#717784] font-medium block">Operational Base</span>
                  <p className="font-bold text-[#0a0a0a] text-xs mt-0.5">
                    {worker?.address || worker?.city || worker?.location || 'Local Matching Hub'}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e6e8ec]">
                  <span className="text-[#717784] font-medium block">Relocation Willingness</span>
                  <p className={`font-bold mt-0.5 flex items-center gap-1.5 ${w?.willingToRelocate ? 'text-emerald-700' : 'text-[#0a0a0a]'}`}>
                    {w?.willingToRelocate ? (
                      <>
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Willing to travel for out-of-town jobs</span>
                      </>
                    ) : (
                      <span>Local work only (no relocation)</span>
                    )}
                  </p>
                </div>

                {w?.preferredCities && w.preferredCities.length > 0 && (
                  <div className="pt-2 border-t border-[#e6e8ec]">
                    <span className="text-[#717784] font-medium block mb-1.5">Target Cities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {w.preferredCities.map((city: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-white rounded-full text-[11px] font-medium text-[#0a0a0a] border border-[#e6e8ec]">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TrustHyre Protection Guarantee */}
            <div className="bg-[#f4f4f4] rounded-[1.75rem] p-6 border border-[#e6e8ec] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase text-[#0a0a0a]">TrustHyre SLA Guarantee</h3>
              </div>
              <ul className="text-xs text-[#717784] space-y-2">
                <li className="flex items-center gap-2 text-[#0a0a0a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Direct wage escrow lock on offer dispatch</span>
                </li>
                <li className="flex items-center gap-2 text-[#0a0a0a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>100% Aadhaar & biometric check verified</span>
                </li>
                <li className="flex items-center gap-2 text-[#0a0a0a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Zero-notice candidate replacement backup</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      {/* Verified Resume Modal */}
      <CandidateResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        data={resumeData}
      />

      {/* Send Job Offer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col border border-[#e6e8ec] font-['Onest',system-ui,sans-serif]"
            >
              <div className="p-6 border-b border-[#e6e8ec] flex justify-between items-center bg-[#f4f4f4]">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0a0a0a]">Send Job Offer</h2>
                  <p className="text-xs text-[#717784] font-medium">Select an open job to dispatch to {worker?.name || 'this specialist'}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#717784] hover:text-[#0a0a0a] hover:bg-white rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                {errorMessage && (
                  <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <p className="text-xs text-[#717784] font-bold uppercase mb-3">
                  Your Active Job Openings:
                </p>
                
                {isLoadingJobs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#0f2f63] animate-spin" />
                  </div>
                ) : myJobs && myJobs.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {myJobs.map((job: any) => {
                      const appForJob = applicationsByJobId.get(job.id);
                      const isOfferSentForJob = appForJob?.status === 'OFFER_SENT';
                      const isApprovedForJob = appForJob?.status === 'ACCEPTED' || appForJob?.status === 'APPROVED';
                      const isDeclinedForJob = appForJob?.status === 'REJECTED' || appForJob?.status === 'DECLINED';
                      const isPendingForJob = appForJob?.status === 'PENDING';
                      const isBlocked = isOfferSentForJob || isApprovedForJob || isDeclinedForJob;

                      return (
                        <label 
                          key={job.id}
                          className={`flex items-start p-4 rounded-2xl border transition-all ${
                            isBlocked
                              ? 'border-[#e6e8ec] bg-[#f4f4f4]/60 opacity-60 cursor-not-allowed'
                              : selectedJobId === job.id 
                              ? 'border-[#0f2f63] bg-[#0f2f63]/5 cursor-pointer shadow-xs' 
                              : 'border-[#e6e8ec] hover:border-[#0f2f63]/40 hover:bg-[#f4f4f4] cursor-pointer'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="jobSelection" 
                            className="mt-1 sr-only"
                            disabled={isBlocked}
                            checked={selectedJobId === job.id}
                            onChange={() => !isBlocked && setSelectedJobId(job.id)}
                          />
                          <div className="flex-1 ml-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`font-bold text-xs ${selectedJobId === job.id ? 'text-[#0f2f63]' : 'text-[#0a0a0a]'}`}>
                                {job.title}
                              </h4>
                              {isApprovedForJob && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold">
                                  Hired
                                </span>
                              )}
                              {isOfferSentForJob && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-semibold">
                                  Offer Sent
                                </span>
                              )}
                              {isDeclinedForJob && (
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-semibold">
                                  Declined
                                </span>
                              )}
                              {isPendingForJob && (
                                <span className="px-2 py-0.5 bg-blue-50 text-[#0f2f63] border border-blue-200 rounded-full text-[10px] font-semibold">
                                  Applied
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#717784] font-medium mt-1">
                              {job.location || job.city || 'Location on file'} • ₹{job.budget?.toLocaleString() || '0'}
                            </p>
                            {isBlocked && (
                              <p className="text-[11px] font-medium mt-1 text-[#717784]">
                                {isApprovedForJob 
                                  ? 'Candidate is already hired for this position.' 
                                  : isOfferSentForJob 
                                  ? 'An offer has already been sent for this job.' 
                                  : 'Offer for this position was previously declined.'}
                              </p>
                            )}
                          </div>
                          {!isBlocked && (
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                              selectedJobId === job.id ? 'border-[#0f2f63]' : 'border-[#e6e8ec]'
                            }`}>
                              {selectedJobId === job.id && <div className="w-2 h-2 rounded-full bg-[#0f2f63]" />}
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-[#f4f4f4] rounded-2xl border border-[#e6e8ec]">
                    <p className="text-[#717784] font-medium text-xs">You don't have any active job openings to offer.</p>
                  </div>
                )}
              </div>
              
              <div className="p-5 border-t border-[#e6e8ec] bg-[#f4f4f4] flex justify-end gap-2.5">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 font-medium text-[#717784] hover:bg-white rounded-full transition-colors cursor-pointer text-xs uppercase"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmOffer}
                  disabled={!selectedJobId || dispatchOfferMutation.isPending}
                  className="px-6 py-2.5 font-medium text-white bg-[#0f2f63] hover:bg-[#2563c9] rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-xs text-xs uppercase active:scale-95"
                >
                  {dispatchOfferMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm & Send Offer</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
