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
  Check
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
    phoneNumber: worker?.phoneNumber || w?.phone_number || '+91 98765 43210',
    email: worker?.email || 'candidate@trusthire.in',
    profileImageUrl: worker?.profilePhoto || (worker as any)?.profileImageUrl || (worker as any)?.profile_image_url || w?.profilePhoto || w?.profileImageUrl || w?.profile_image_url || undefined,
    city: worker?.city || worker?.location || 'Chennai, India',
    area: w?.area || worker?.address || '',
    location: worker?.address || worker?.location,
    bio: worker?.bio || 'Dedicated professional with verified skills, strong work ethic, and quick learning capabilities.',
    highestEducation: w?.highestEducation || w?.highest_education || 'Graduate / Diploma',
    isPursuingEducation: Boolean(w?.isPursuingEducation || w?.is_pursuing_education),
    collegeName: w?.collegeName || w?.college_name || '',
    degree: w?.degree || '',
    specialization: w?.specialization || '',
    schoolMedium: w?.schoolMedium || w?.school_medium || '',
    englishProficiency: englishLevelLabel,
    languagesKnown: w?.languagesKnown && w.languagesKnown.length > 0 ? w.languagesKnown : ['English', 'Hindi', 'Tamil'],
    skills: worker?.skills && worker.skills.length > 0 ? worker.skills : ['Problem Solving', 'Customer Service'],
    preferredRoles: w?.preferredRoles && w.preferredRoles.length > 0 ? w.preferredRoles : (worker?.skills || ['Specialist']),
    preferredCities: w?.preferredCities || w?.preferred_cities || [],
    willingToRelocate: Boolean(w?.willingToRelocate || w?.willing_to_relocate),
    trustScore: worker?.trustScore || 85,
    level: String(worker?.level || 'L1'),
    isVerified: isVerified,
    dob: w?.dob || '',
    gender: w?.gender || '',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 space-y-6">
        
        {/* Header Navigation */}
        <header className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0A1931] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Candidate Search</span>
          </button>
          
          <div className="flex gap-2.5">
            <button 
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3.5 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Resume / CV</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 hover:text-[#0066FF] hover:border-blue-200 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button 
              onClick={handleToggleSave}
              className={`p-2.5 rounded-xl shadow-xs border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isSaved 
                  ? 'bg-blue-50 border-blue-200 text-[#0066FF]' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0066FF] hover:border-blue-200'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Profile'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top Banner Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0066FF] via-[#38BDF8] to-[#0A1931]"></div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 w-full md:w-auto text-center sm:text-left">
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
                
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">{worker?.name || 'Candidate Name'}</h1>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                      isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
                      {isVerified ? 'Verified Candidate' : 'Unverified Worker'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                    <span className="text-slate-600 font-bold text-sm flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#0066FF]" />
                      {w?.preferredRoles?.[0] || worker?.skills?.[0] || 'Specialist'}
                    </span>
                    <span className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {worker?.city || worker?.location || 'Location Not Set'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${worker?.availability === 'AVAILABLE' ? 'bg-[#0066FF]/10 text-[#0066FF]' : 'bg-slate-100 text-slate-600'}`}>
                      {worker?.availability === 'AVAILABLE' ? '• Available for Hire' : 'Currently Busy'}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                      {worker?.experience || 0} Years Exp.
                    </span>
                    <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> TrustScore: {worker?.trustScore || 85}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                 {(() => {
                   const hasApproved = existingApplications.some((a: any) => a.status === 'ACCEPTED' || a.status === 'APPROVED');
                   const hasOfferSent = existingApplications.some((a: any) => a.status === 'OFFER_SENT');
                   const hasDeclined = existingApplications.length > 0 && existingApplications.every((a: any) => a.status === 'REJECTED' || a.status === 'DECLINED');

                   return (
                     <button 
                       onClick={handleDispatchOffer}
                       className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer ${
                         hasApproved
                           ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                           : hasOfferSent
                           ? 'bg-amber-500 hover:bg-amber-600 text-white'
                           : hasDeclined
                           ? 'bg-rose-500 hover:bg-rose-600 text-white'
                           : 'bg-[#0066FF] hover:bg-[#0052cc] text-white'
                       }`}
                     >
                       {hasApproved 
                         ? 'Approved for Job' 
                         : hasOfferSent 
                         ? 'Offer Sent' 
                         : hasDeclined 
                         ? 'Offer Declined' 
                         : 'Send Job Offer'}
                     </button>
                   );
                 })()}

                 <button
                   onClick={() => setIsResumeModalOpen(true)}
                   className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                 >
                   <FileText className="w-4 h-4 text-slate-600" /> View Digital CV
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: Education, Languages, Skills & Bio */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Academic & Education Background */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#0066FF]" /> Academic Background & Education
                    </h3>
                    {w?.highestEducation && (
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200/60">
                        {w.highestEducation}
                      </span>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Qualification</span>
                      <p className="text-sm font-bold text-slate-900">
                        {w?.highestEducation || 'High School / Secondary'}
                      </p>
                      <span className="inline-block text-[11px] font-semibold text-emerald-600">
                        {w?.isPursuingEducation ? '• Currently Studying / Enrolled' : '• Completed Course'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Degree & Specialization</span>
                      <p className="text-sm font-bold text-slate-900">
                        {w?.degree || w?.specialization || w?.schoolMedium ? (
                          `${w?.degree || ''} ${w?.specialization ? `(${w.specialization})` : ''} ${w?.schoolMedium ? `- ${w.schoolMedium}` : ''}`.trim()
                        ) : (
                          'General Curriculum'
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {w?.collegeName || 'Recognized Board / University'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Language Competencies */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                    <Languages className="w-5 h-5 text-[#0066FF]" /> Language Competencies
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">English Proficiency</span>
                      <p className="text-sm font-black text-[#0A1931]">{englishLevelLabel}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Workplace communication readiness</p>
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Languages Spoken</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {w?.languagesKnown && w.languagesKnown.length > 0 ? (
                          w.languagesKnown.map((lang: string, idx: number) => (
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

                {/* Target Job Roles & Skills */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#0066FF]" /> Target Job Roles & Verified Skills
                  </h3>
                  
                  <div className="space-y-4 pt-1">
                    {w?.preferredRoles && w.preferredRoles.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Preferred Roles:</span>
                        <div className="flex flex-wrap gap-2">
                          {w.preferredRoles.map((role: string, idx: number) => (
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
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Technical Skills:</span>
                      <div className="flex flex-wrap gap-2">
                        {worker?.skills && worker.skills.length > 0 ? (
                          worker.skills.map((skill, idx) => (
                            <div 
                              key={idx} 
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-bold text-xs shadow-2xs transition-all hover:bg-emerald-100/70"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{skill.trim()}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic text-sm">No specialized skills listed.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Bio */}
                {worker?.bio && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-[#0A1931] mb-3">Professional Summary</h3>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                      {worker.bio}
                    </p>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Contact, Location & Verified Resume Action */}
              <div className="space-y-6">
                
                {/* Instant Resume Card */}
                <div className="bg-linear-to-br from-[#0A1931] to-[#1E3A8A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-800 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FACD15]" />
                    <span>Verified Recruiter Dossier</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight">Standard Format CV</h4>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                      View or export the candidate's complete verified profile formatted for recruitment verification.
                    </p>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsResumeModalOpen(true)}
                      className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Verified Resume / CV</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResumeModalOpen(true);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print / Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Candidate Personal Dossier */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#0A1931] uppercase tracking-wider flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-[#0066FF]" /> Candidate Dossier
                  </h3>
                  
                  <div className="space-y-3 pt-1 text-xs">
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
                      <span className="font-bold text-slate-800">
                        {worker?.phoneNumber || 'Contact on Hire'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                      </span>
                      <span className="font-bold text-slate-800 truncate max-w-[160px]" title={worker?.email}>
                        {worker?.email || 'Registered Worker Email'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Alerts
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        w?.whatsappOptIn !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {w?.whatsappOptIn !== false ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location & Mobility Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#0A1931] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" /> Location & Mobility
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Current Base</span>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">
                        {worker?.address || worker?.city || worker?.location || 'Location on file'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 font-medium block">Relocation Willingness</span>
                      <p className={`font-bold mt-0.5 flex items-center gap-1.5 ${w?.willingToRelocate ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {w?.willingToRelocate ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Willing to relocate for work</span>
                          </>
                        ) : (
                          <span>Local region only</span>
                        )}
                      </p>
                    </div>

                    {w?.preferredCities && w.preferredCities.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-400 font-medium block mb-1.5">Preferred Relocation Cities:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {w.preferredCities.map((city: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black text-[#0A1931]">Send Job Offer</h2>
                  <p className="text-xs text-slate-400 font-medium">Select an open job to send to {worker?.name || 'this candidate'}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
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

                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
                  Your Active Job Openings:
                </p>
                
                {isLoadingJobs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
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
                          className={`flex items-start p-4 rounded-xl border-2 transition-all ${
                            isBlocked
                              ? 'border-slate-100 bg-slate-50/70 opacity-70 cursor-not-allowed'
                              : selectedJobId === job.id 
                              ? 'border-[#0066FF] bg-blue-50/50 cursor-pointer' 
                              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer'
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
                              <h4 className={`font-bold text-sm ${selectedJobId === job.id ? 'text-[#0066FF]' : 'text-[#0A1931]'}`}>
                                {job.title}
                              </h4>
                              {isApprovedForJob && (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Approved
                                </span>
                              )}
                              {isOfferSentForJob && (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Offer Sent
                                </span>
                              )}
                              {isDeclinedForJob && (
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Declined
                                </span>
                              )}
                              {isPendingForJob && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-extrabold uppercase">
                                  Applied
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              {job.location || job.city || 'Location on file'} • ₹{job.budget?.toLocaleString() || '0'}
                            </p>
                            {isBlocked && (
                              <p className="text-[11px] font-bold mt-1 text-slate-400">
                                {isApprovedForJob 
                                  ? 'Candidate is already hired for this position.' 
                                  : isOfferSentForJob 
                                  ? 'An offer has already been sent for this job.' 
                                  : 'Offer for this position was previously declined.'}
                              </p>
                            )}
                          </div>
                          {!isBlocked && (
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                              selectedJobId === job.id ? 'border-[#0066FF]' : 'border-slate-300'
                            }`}>
                              {selectedJobId === job.id && <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />}
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500 font-medium text-xs">You don't have any active job openings to offer.</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmOffer}
                  disabled={!selectedJobId || dispatchOfferMutation.isPending}
                  className="px-6 py-2.5 font-bold text-white bg-[#0066FF] hover:bg-[#0052cc] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 text-xs"
                >
                  {dispatchOfferMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm & Send Offer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
