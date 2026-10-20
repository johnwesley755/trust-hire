import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { queryKeys } from "../../../lib/queryKeys";
import { 
  User, 
  MapPin, 
  Sparkles, 
  Check, 
  Loader2, 
  LocateFixed, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  GraduationCap,
  Languages,
  Briefcase,
  Search,
  X,
  FileText,
  Zap,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Camera,
  UploadCloud,
  Image as ImageIcon,
  Plus,
  Wrench,
  Clock,
  RotateCcw
} from "lucide-react";
import { CandidateResumeModal } from "../components/resume/CandidateResumeModal";
import type { ResumeData } from "../components/resume/CandidateResumeView";
import { OnboardingVisualHero } from "../components/OnboardingVisualHero";

const EDUCATION_LEVELS = [
  "10th or Below 10th",
  "12th Pass",
  "Diploma",
  "ITI",
  "Graduate",
  "Post Graduate"
];

const DEGREE_OPTIONS = [
  "B.Com",
  "B.Sc",
  "B.Tech / B.E.",
  "BCA",
  "BBA",
  "BA",
  "Diploma in Engineering",
  "ITI Certificate",
  "M.Sc",
  "M.Com",
  "MCA",
  "MBA",
  "Other Degree"
];

const SCHOOL_MEDIUMS = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Other"
];

const ENGLISH_LEVELS = [
  { id: "NONE", label: "No English", desc: "Prefer native / regional languages" },
  { id: "BASIC", label: "Basic", desc: "You can understand/speak basic sentences & greetings" },
  { id: "INTERMEDIATE", label: "Intermediate", desc: "You can have a conversation in English on most topics" },
  { id: "ADVANCED", label: "Advanced", desc: "You can do your entire job in English and speak fluently" }
];

const POPULAR_LANGUAGES = [
  "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam",
  "Marathi", "Bengali", "Gujarati", "Urdu", "Punjabi",
  "Odia", "Assamese", "Nepali", "French", "German", "Spanish"
];

const POPULAR_JOB_ROLES = [
  "Electrician",
  "Plumber",
  "Delivery Driver",
  "Warehouse Associate",
  "Cook / Chef / Kitchen Help",
  "Retail Sales & Operations",
  "Customer Support / BPO",
  "Data Entry / Computer Operator",
  "Field Sales Executive",
  "Security Guard",
  "Facility & Cleaning",
  "Mechanic",
  "Carpenter",
  "Welder",
  "Telesales"
];

const POPULAR_REGIONS = [
  "Chennai Region, TN",
  "Bengaluru Region, KA",
  "Hyderabad Region, TS",
  "Mumbai Region, MH",
  "Pune Region, MH",
  "Delhi NCR Region",
  "Pondicherry Region, TN",
  "Coimbatore Region, TN",
  "Kochi Region, KL"
];

const POPULAR_SKILLS = [
  "Maintenance & Repair",
  "Electrical Wiring",
  "Pipe Fitting & Plumbing",
  "Customer Support",
  "Inventory & Warehousing",
  "Driving & Delivery",
  "Cooking & Food Safety",
  "MS Office / Data Entry",
  "Retail Sales & Cash Handling",
  "Facility Cleaning",
  "Carpentry & Woodwork",
  "Machine Operation",
  "Welding & Fabrication",
  "First Aid & Security"
];

const STEP_TITLES: Record<number, string> = {
  1: "Basic Details & Photo",
  2: "Personal Demographics",
  3: "Location & Commute",
  4: "Education & Credentials",
  5: "Languages Known",
  6: "Trade, Skills & Experience"
};

export default function WorkerOnboardingPage() {
  const { user } = useUser();
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Wizard Step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ""
  );
  const [highestEducation, setHighestEducation] = useState<string>("Graduate");
  
  // Mandatory Profile Photo
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    user?.profileImageUrl || (user as any)?.profile_image_url || (user as any)?.photoURL || ""
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Step 2: Demographics
  const [dob, setDob] = useState<string>("2000-01-01");
  const [gender, setGender] = useState<string>("Male");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    user?.phoneNumber || (user as any)?.phone_number || ""
  );
  const [whatsappOptIn, setWhatsappOptIn] = useState<boolean>(true);

  // Step 3: Location
  const [city, setCity] = useState<string>(user?.location || "Chennai");
  const [area, setArea] = useState<string>("Royapuram");
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [willingToRelocate, setWillingToRelocate] = useState<boolean>(false);
  const [preferredCities, setPreferredCities] = useState<string[]>(["Chennai Region, TN"]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [citySearchQuery, setCitySearchQuery] = useState<string>("");

  // Step 4: Education Deep Dive
  const [isPursuingEducation, setIsPursuingEducation] = useState<boolean>(false);
  const [collegeName, setCollegeName] = useState<string>("");
  const [degree, setDegree] = useState<string>("B.Sc");
  const [specialization, setSpecialization] = useState<string>("Computer Science");
  const [schoolMedium, setSchoolMedium] = useState<string>("English");

  // Step 5: Language Matrix
  const [englishProficiency, setEnglishProficiency] = useState<string>("ADVANCED");
  const [languagesKnown, setLanguagesKnown] = useState<string[]>(["Tamil", "English", "Hindi"]);

  // Step 6: Preferred Job Roles, Skills, Experience & Bio
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [roleSearchInput, setRoleSearchInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [bio, setBio] = useState<string>("");

  // Global Submission & Resume Preview
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [generatedResumeData, setGeneratedResumeData] = useState<ResumeData | null>(null);
  const hasSynced = useRef<boolean>(false);

  // Sync initial user details from backend
  const { data: freshUser } = useQuery({
    queryKey: ['authMe'],
    queryFn: async () => {
      const res = await apiClient.get('/api/auth/me');
      return res.data;
    },
    staleTime: Infinity
  });

  useEffect(() => {
    if (freshUser && !hasSynced.current) {
      hasSynced.current = true;
      updateUser(freshUser);
      const computedName = `${freshUser.first_name || ''} ${freshUser.last_name || ''}`.trim();
      if (computedName && !fullName) setFullName(computedName);
      if (freshUser.phone_number && !phoneNumber) setPhoneNumber(freshUser.phone_number);
      if (freshUser.email && !email) setEmail(freshUser.email);
      
      const avatarCandidate = freshUser.profile_image_url || freshUser.photoURL || freshUser.avatar_url || (user as any)?.photoURL || user?.profileImageUrl;
      if (avatarCandidate && !profileImageUrl) {
        setProfileImageUrl(avatarCandidate);
      }
    }
  }, [freshUser, fullName, phoneNumber, email, profileImageUrl, user, updateUser]);

  // Handle Photo Upload with Client-Side Canvas Compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file is too large (max 10MB).");
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setProfileImageUrl(compressedDataUrl);
        } else {
          setProfileImageUrl(event.target?.result as string);
        }
        setIsUploadingPhoto(false);
      };
      img.onerror = () => {
        setErrorMessage("Could not process image. Please try another.");
        setIsUploadingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read image file.");
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // GPS Locate Action
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          if (data && data.address) {
            const detectedCity = data.address.city || data.address.town || data.address.state_district || "Chennai";
            const detectedArea = data.address.suburb || data.address.neighbourhood || data.address.road || "Central";
            setCity(detectedCity);
            setArea(detectedArea);
            setAddress(data.display_name || "");
          }
        } catch {
          // fallback
          setCity("Chennai");
          setArea("Guindy");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        setErrorMessage("GPS location denied. Please select your city manually.");
      },
      { timeout: 8000 }
    );
  };

  // Toggle Language
  const handleToggleLanguage = (lang: string) => {
    if (languagesKnown.includes(lang)) {
      if (languagesKnown.length > 1) {
        setLanguagesKnown(languagesKnown.filter(l => l !== lang));
      }
    } else {
      setLanguagesKnown([...languagesKnown, lang]);
    }
  };

  // Toggle Preferred Role Pill
  const handleToggleRole = (role: string) => {
    if (preferredRoles.includes(role)) {
      if (preferredRoles.length > 1) {
        setPreferredRoles(preferredRoles.filter(r => r !== role));
      }
    } else {
      setPreferredRoles([...preferredRoles, role]);
    }
  };

  // Add custom role from search input
  const handleAddCustomRole = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && roleSearchInput.trim()) {
      e.preventDefault();
      const val = roleSearchInput.trim();
      if (!preferredRoles.includes(val)) {
        setPreferredRoles([...preferredRoles, val]);
      }
      setRoleSearchInput("");
    }
  };

  // Toggle Region
  const handleToggleRegion = (reg: string) => {
    if (preferredCities.includes(reg)) {
      setPreferredCities(preferredCities.filter(r => r !== reg));
    } else {
      setPreferredCities([...preferredCities, reg]);
    }
  };

  // Core Skills Management
  const handleAddSkill = (skillToAdd?: string) => {
    const val = (skillToAdd || skillInput).trim();
    if (!val) return;
    if (!skills.includes(val)) {
      setSkills(prev => [...prev, val]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Auto-Generate / Refresh Bio
  const handleGenerateBio = () => {
    const fullLoc = `${area ? area + ', ' : ''}${city}`;
    const rolesList = preferredRoles.length > 0 ? preferredRoles.join(', ') : 'Professional specialist';
    const expText = experienceYears > 0 
      ? `${experienceYears} years of verified practical experience` 
      : 'Dedicated and motivated professional ready to contribute immediately';
    const langText = languagesKnown.length > 0 ? `Proficient in ${englishProficiency.toLowerCase()} English and ${languagesKnown.join(', ')}.` : '';
    const skillHighlight = skills.length > 0 ? `Core strengths include ${skills.slice(0, 4).join(', ')}.` : '';
    setBio(`${rolesList} based in ${fullLoc} with ${expText}. ${skillHighlight} ${langText} Punctual, reliable, and committed to delivering high-quality work.`.trim());
  };

  // Navigation Steps
  const nextStep = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (!profileImageUrl) {
        setErrorMessage("Please upload or provide a profile photo. A photo is mandatory to complete candidate verification.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const clean = phoneNumber.replace(/\D/g, '');
      if (clean.length !== 10) {
        setErrorMessage("Please provide a valid 10-digit mobile number.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!city) {
        setErrorMessage("Please select your city.");
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      if (!bio.trim()) {
        const fullLoc = `${area ? area + ', ' : ''}${city}`;
        const rolesList = preferredRoles.length > 0 ? preferredRoles.join(', ') : 'Professional candidate';
        const expText = experienceYears > 0 ? `${experienceYears} years experience` : 'Eager to work';
        setBio(`${rolesList} based in ${fullLoc} with ${expText}. Proficient in ${englishProficiency.toLowerCase()} English and ${languagesKnown.join(', ')}.`);
      }
      setCurrentStep(6);
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit Final Profile
  const handleSubmitProfile = async () => {
    setErrorMessage(null);
    if (!profileImageUrl) {
      setErrorMessage("Please upload a profile photo before completing onboarding.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    const fullLoc = `${area ? area + ', ' : ''}${city}`;
    const combinedSkills = Array.from(new Set([...skills, ...preferredRoles]));
    const finalBio = bio.trim() || `${preferredRoles.join(', ')} specialist based in ${fullLoc}. ${experienceYears > 0 ? `${experienceYears} years experience.` : 'Enthusiastic candidate.'} Proficient in ${englishProficiency.toLowerCase()} English and ${languagesKnown.join(', ')}.`;

    const resumeData: ResumeData = {
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      email: email,
      profileImageUrl: profileImageUrl || undefined,
      city: city,
      area: area,
      location: fullLoc,
      bio: finalBio,
      highestEducation,
      isPursuingEducation,
      collegeName: collegeName.trim() || undefined,
      degree: degree || undefined,
      specialization: specialization.trim() || undefined,
      schoolMedium: schoolMedium || undefined,
      englishProficiency,
      languagesKnown,
      skills: combinedSkills,
      preferredRoles,
      preferredCities,
      willingToRelocate,
      trustScore: 88,
      level: 'L1',
      isVerified: true
    };

    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || 'Worker';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 1. Sync User Metadata
      await apiClient.post('/api/auth/sync', {
        role: 'WORKER',
        first_name: firstName,
        last_name: lastName,
        phone_number: cleanPhone,
        city,
        location: fullLoc,
        profile_image_url: profileImageUrl,
        onboarded: true
      });

      // 2. Upsert Dedicated Worker Profile
      await apiClient.put('/api/worker/profile', {
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        city,
        area,
        address: address || fullLoc,
        latitude,
        longitude,
        isAvailable: true,
        dob,
        gender,
        whatsappOptIn,
        willingToRelocate,
        preferredCities,
        highestEducation,
        isPursuingEducation,
        collegeName,
        degree,
        specialization,
        schoolMedium,
        englishProficiency,
        languagesKnown,
        preferredRoles,
        skills: combinedSkills,
        bio: finalBio,
        experienceYears: Number(experienceYears) || 0,
        experience_years: Number(experienceYears) || 0
      });

      // Invalidate worker query caches across the app
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.detail('me') });

      localStorage.setItem('onboarded', 'true');
      updateUser({
        ...user,
        onboarded: true,
        phoneNumber: cleanPhone,
        firstName,
        lastName,
        profileImageUrl: profileImageUrl,
        profile_image_url: profileImageUrl
      });

      setGeneratedResumeData(resumeData);
      setShowResumeModal(true);
    } catch (error: any) {
      console.error("Worker onboarding error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to save profile. Please check your information.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.round((currentStep / 6) * 100);

  return (
    <div className="w-full min-h-screen p-2 sm:p-3 bg-white font-['Onest',system-ui,sans-serif] selection:bg-[#2563c9] selection:text-white flex flex-col">
      
      {/* Framed Full-Screen Canvas matching Landing & Auth Architecture */}
      <div className="relative w-full flex-1 min-h-[calc(100svh-1rem)] sm:min-h-[calc(100svh-1.5rem)] lg:h-[calc(100svh-1.5rem)] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-[#e6e8ec] bg-white shadow-xl grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Side: Full-Bleed Brand Visual Hero with Sector Photography */}
        <div className="lg:col-span-5 xl:col-span-5 hidden lg:block h-full">
          <OnboardingVisualHero 
            role="WORKER" 
            currentStep={currentStep} 
            totalSteps={6} 
          />
        </div>

        {/* Right Side: Clean Modern Form with Independent Smooth Scroll */}
        <div className="lg:col-span-7 xl:col-span-7 p-4 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-white h-full overflow-y-auto">
          
          {/* Mobile Banner with Sector Photography & Logo (Visible only on < lg screens) */}
          <div className="block lg:hidden mb-4">
            <OnboardingVisualHero 
              role="WORKER" 
              currentStep={currentStep} 
              totalSteps={6} 
              isMobileBanner={true} 
            />
          </div>

          {/* Top Navigation Row: Step Counter + Back Button + Sign Out */}
          <div className="shrink-0">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#717784] hover:text-[#0A1931] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
                <div>
                  <h1 className="text-sm font-bold text-[#0A1931] leading-tight">
                    {STEP_TITLES[currentStep]}
                  </h1>
                  <p className="text-[11px] text-[#717784] font-medium hidden sm:block">
                    Step {currentStep} of 6 • TrustHyre Candidate Verification
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#0f2f63]">
                  Step {currentStep} of 6
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#717784] hover:text-[#0A1931] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>

            {/* Sleek Minimal Progress Bar */}
            <div className="w-full bg-[#f4f4f4] h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-[#0f2f63] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* FORM BODY BY STEP */}
          <div className="flex-1 flex flex-col justify-center py-2">
            
            {/* Step 1: Basic Details & Highest Education */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    Tell us your full name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name (e.g. John Wesley)"
                    required
                    className="w-full bg-white border border-[#e6e8ec] hover:border-[#0f2f63]/50 focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-4 py-3 text-sm text-[#0A1931] outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>

                {/* Mandatory Candidate Profile Photo Upload */}
                <div className="space-y-2.5 p-4 sm:p-5 bg-[#fbfbfb] border border-[#e6e8ec] rounded-2xl shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0A1931] flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-[#0f2f63]" />
                      Candidate Profile Photo *
                    </label>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Mandatory for Verification
                    </span>
                  </div>
                  
                  <p className="text-xs text-[#717784] leading-relaxed">
                    Employers prefer candidates with a clear, verifiable photo. If signed in with Google, your avatar is automatically linked.
                  </p>

                  <input 
                    type="file" 
                    ref={photoInputRef}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-4 pt-1">
                    {/* Photo Preview Thumbnail */}
                    <div className="relative group shrink-0">
                      {profileImageUrl ? (
                        <img 
                          src={profileImageUrl} 
                          alt="Profile Preview" 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f4f4f4] border-2 border-dashed border-[#e6e8ec] flex flex-col items-center justify-center text-slate-400">
                          <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
                          <span className="text-[9px] font-bold">No Photo</span>
                        </div>
                      )}

                      {profileImageUrl && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Upload Actions & Status */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-[#0A1931] border border-[#e6e8ec] hover:border-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          {isUploadingPhoto ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0f2f63]" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5 text-[#0f2f63]" />
                              <span>{profileImageUrl ? "Change Photo" : "Upload Photo"}</span>
                            </>
                          )}
                        </button>

                        {profileImageUrl && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Photo Attached
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#717784] font-medium">
                        Supports JPG, PNG, WEBP (Max 10MB, auto-compressed)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education Level Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    What is your highest level of education? *
                  </label>
                  <p className="text-xs text-[#717784]">
                    Select highest education level even if not completed
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {EDUCATION_LEVELS.map((edu) => (
                      <button
                        key={edu}
                        type="button"
                        onClick={() => setHighestEducation(edu)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          highestEducation === edu
                            ? "bg-[#0f2f63] text-white shadow-xs"
                            : "bg-[#f4f4f4] text-[#717784] hover:text-[#0A1931] hover:bg-slate-200/80"
                        }`}
                      >
                        {edu}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Demographics & Contact */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-[#e6e8ec] rounded-xl px-4 py-2.5 text-xs text-[#0A1931] font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Date of Birth (DOB) *
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                      className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Gender *
                    </label>
                    <div className="flex gap-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            gender === g
                              ? "bg-[#0f2f63] text-white border-[#0f2f63] shadow-xs"
                              : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@gmail.com"
                    className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Mobile Phone Number *
                    </label>
                    <span className="text-[10px] text-[#717784] font-medium">10-Digit Mobile</span>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-700 font-bold text-xs pointer-events-none select-none border-r border-slate-200 pr-2.5 z-10">
                      <span className="text-sm leading-none">🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      placeholder="98765 43210"
                      required
                      className="w-full bg-white border border-[#e6e8ec] hover:border-[#0f2f63]/50 focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl pl-18 pr-4 py-2.5 text-xs text-[#0A1931] font-semibold transition-all outline-none"
                    />
                  </div>
                </div>

                {/* WhatsApp Opt-in Checkbox */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbfbfb] border border-[#e6e8ec] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    className="mt-0.5 rounded text-[#0f2f63] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#0A1931] font-medium leading-relaxed">
                    Send me important job offers, interview alerts, and employer calls on WhatsApp
                  </span>
                </label>
              </div>
            )}

            {/* Step 3: Location Details & Hyperlocal Area */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#fbfbfb] border border-[#e6e8ec] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A1931]">Current Base Location</span>
                    <button
                      type="button"
                      onClick={() => setIsCityModalOpen(true)}
                      className="text-xs font-bold text-[#0f2f63] hover:underline cursor-pointer"
                    >
                      Change City
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-[#0A1931] bg-white p-3 rounded-xl border border-[#e6e8ec]">
                    <MapPin className="w-4 h-4 text-[#0f2f63] shrink-0" />
                    <span>{area ? `${area}, ` : ''}{city}, India</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="w-full bg-white hover:bg-slate-50 text-[#0f2f63] border border-[#0f2f63]/30 hover:border-[#0f2f63] py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4 text-[#0f2f63]" />}
                    <span>{isLocating ? "Detecting GPS location..." : "Update via One-Click GPS"}</span>
                  </button>
                </div>

                {/* Relocation Preference */}
                <div className="space-y-3 pt-2 border-t border-[#e6e8ec]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    Would you also like to explore jobs outside {city}?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setWillingToRelocate(true)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        willingToRelocate
                          ? "bg-[#0f2f63] text-white border-[#0f2f63] shadow-xs"
                          : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                      }`}
                    >
                      Yes, Open to Relocate
                    </button>
                    <button
                      type="button"
                      onClick={() => setWillingToRelocate(false)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        !willingToRelocate
                          ? "bg-[#0f2f63] text-white border-[#0f2f63] shadow-xs"
                          : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                      }`}
                    >
                      Local Commute Only
                    </button>
                  </div>

                  {willingToRelocate && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-[#717784]">
                        Select Preferred Regions / Cities:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_REGIONS.map((reg) => (
                          <button
                            key={reg}
                            type="button"
                            onClick={() => handleToggleRegion(reg)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                              preferredCities.includes(reg)
                                ? "bg-[#0f2f63] text-white border-[#0f2f63]"
                                : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                            }`}
                          >
                            {reg} {preferredCities.includes(reg) ? "✓" : "+"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Education Details Deep Dive */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    Are you currently pursuing your education? *
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPursuingEducation(true)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isPursuingEducation
                          ? "bg-[#0f2f63] text-white border-[#0f2f63] shadow-xs"
                          : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                      }`}
                    >
                      Yes (Currently Enrolled)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPursuingEducation(false)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        !isPursuingEducation
                          ? "bg-[#0f2f63] text-white border-[#0f2f63] shadow-xs"
                          : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                      }`}
                    >
                      No (Completed)
                    </button>
                  </div>
                </div>

                {/* Conditional Form fields based on Education Level */}
                {highestEducation.includes("Graduate") || highestEducation === "Diploma" || highestEducation === "ITI" ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                        College / Institute Name
                      </label>
                      <input
                        type="text"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="e.g. Govt ITI Chennai / Loyola College"
                        className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                          Degree / Qualification
                        </label>
                        <select
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                        >
                          {DEGREE_OPTIONS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                          Specialization / Major
                        </label>
                        <input
                          type="text"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="e.g. Electrical / Computer Science"
                          className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                        School Medium of Instruction
                      </label>
                      <select
                        value={schoolMedium}
                        onChange={(e) => setSchoolMedium(e.target.value)}
                        className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl px-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                      >
                        {SCHOOL_MEDIUMS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Language Matrix */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    English Proficiency Level *
                  </label>
                  <div className="space-y-2">
                    {ENGLISH_LEVELS.map((lvl) => (
                      <div
                        key={lvl.id}
                        onClick={() => setEnglishProficiency(lvl.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          englishProficiency === lvl.id
                            ? "border-[#0f2f63] bg-[#0f2f63]/5 shadow-xs"
                            : "border-[#e6e8ec] bg-white hover:border-[#0f2f63]/40"
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-bold ${englishProficiency === lvl.id ? "text-[#0f2f63]" : "text-[#0A1931]"}`}>
                            {lvl.label}
                          </p>
                          <p className="text-[11px] text-[#717784] mt-0.5">{lvl.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          englishProficiency === lvl.id ? "border-[#0f2f63] bg-[#0f2f63]" : "border-slate-300"
                        }`}>
                          {englishProficiency === lvl.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Indian Languages */}
                <div className="space-y-2.5 pt-2 border-t border-[#e6e8ec]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                    Add other languages you can speak
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                    {POPULAR_LANGUAGES.map((lang) => {
                      const isSelected = languagesKnown.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleToggleLanguage(lang)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#0f2f63] text-white border-[#0f2f63]"
                              : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                          }`}
                        >
                          {lang} {isSelected ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Preferred Job Roles, Experience, Skills & Bio */}
            {currentStep === 6 && (
              <div className="space-y-6">
                {/* 1. Target Trade Roles */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Target Trade or Job Role *
                    </label>
                    <span className="text-[11px] text-[#717784]">
                      {preferredRoles.length} selected
                    </span>
                  </div>
                  
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={roleSearchInput}
                      onChange={(e) => setRoleSearchInput(e.target.value)}
                      onKeyDown={handleAddCustomRole}
                      placeholder="Search trade or role (Press Enter to add)..."
                      className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                    />
                  </div>

                  {/* Selected Roles Container */}
                  {preferredRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {preferredRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0f2f63] text-white shadow-2xs"
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleRole(role)}
                            className="hover:text-rose-300 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Popular Trade Roles */}
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-0.5 pt-1">
                    {POPULAR_JOB_ROLES.slice(0, 9).map((role) => {
                      const isSelected = preferredRoles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleToggleRole(role)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#0f2f63] text-white border-[#0f2f63]"
                              : "bg-[#f4f4f4] text-[#717784] border-transparent hover:text-[#0A1931]"
                          }`}
                        >
                          {role} {isSelected ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Total Work Experience */}
                <div className="space-y-2.5 pt-3 border-t border-[#e6e8ec]">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Total Work Experience *
                    </label>
                    <span className="text-xs font-bold text-[#0f2f63]">
                      {experienceYears === 0 ? "Fresher (0 yrs)" : `${experienceYears} ${experienceYears === 1 ? 'Year' : 'Years'} Exp`}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { val: 0, label: "Fresher" },
                      { val: 1, label: "1 Yr" },
                      { val: 2, label: "2 Yrs" },
                      { val: 3, label: "3 Yrs" },
                      { val: 4, label: "4 Yrs" },
                      { val: 5, label: "5+ Yrs" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setExperienceYears(item.val)}
                        className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          experienceYears === item.val
                            ? "bg-[#0f2f63] text-white border-[#0f2f63] shadow-xs"
                            : "bg-[#f8f9fa] text-[#717784] border-[#e6e8ec] hover:border-slate-300 hover:text-[#0A1931]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Core Skills & Specialties */}
                <div className="space-y-2.5 pt-3 border-t border-[#e6e8ec]">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Specific Skills & Strengths *
                    </label>
                    <span className="text-[11px] text-[#717784]">
                      {skills.length} skills listed
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add skill (e.g. Wiring, Fitting, Tally) & press Enter..."
                        className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0A1931] font-semibold outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSkill()}
                      disabled={!skillInput.trim()}
                      className="px-4 py-2.5 bg-[#0f2f63] text-white text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-[#0c244c] cursor-pointer shrink-0 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected Skills Tags */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#0f2f63] border border-blue-200"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Quick Add Skills */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold text-[#717784]">Recommended trade skills:</p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-0.5">
                      {POPULAR_SKILLS.map((sk) => {
                        const isAdded = skills.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => isAdded ? handleRemoveSkill(sk) : handleAddSkill(sk)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border ${
                              isAdded
                                ? "bg-[#0f2f63] text-white border-[#0f2f63]"
                                : "bg-[#f8f9fa] text-[#717784] border-slate-200 hover:text-[#0A1931]"
                            }`}
                          >
                            {sk} {isAdded ? "✓" : "+"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Professional Bio / Candidate Summary */}
                <div className="space-y-2 pt-3 border-t border-[#e6e8ec]">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1931]">
                      Candidate Bio & Summary *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBio}
                      className="text-[11px] font-bold text-[#0f2f63] hover:text-[#0c244c] flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-[#0f2f63]" />
                      <span>{bio.trim() ? "Refresh Summary" : "Auto-Generate"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief summary of your professional background, skills, and work ethic..."
                    className="w-full bg-white border border-[#e6e8ec] focus:border-[#0f2f63] focus:ring-2 focus:ring-[#0f2f63]/10 rounded-xl p-3 text-xs text-[#0A1931] font-medium outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-[#717784]">
                    This summary is visible to verified employers when you apply for positions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ANCHORED BOTTOM ACTION BAR */}
          <div className="pt-4 border-t border-[#e6e8ec] shrink-0 mt-4">
            <div className="flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-3 bg-[#f4f4f4] hover:bg-slate-200/80 text-[#0A1931] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#0f2f63] hover:bg-[#0c244c] active:bg-[#081a38] text-white py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitProfile}
                  disabled={isSubmitting || preferredRoles.length === 0}
                  className="bg-[#0f2f63] hover:bg-[#0c244c] active:bg-[#081a38] disabled:opacity-50 text-white py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Verified Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Profile & View Resume</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* City Search Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-['Onest',system-ui,sans-serif]">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0A1931]">Select your city</h3>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                handleDetectGPS();
                setIsCityModalOpen(false);
              }}
              className="w-full p-3 rounded-xl bg-[#0f2f63]/10 hover:bg-[#0f2f63]/15 text-[#0f2f63] text-xs font-bold flex items-center gap-2 border border-[#0f2f63]/20 cursor-pointer transition-colors"
            >
              <LocateFixed className="w-4 h-4 text-[#0f2f63]" />
              <span>Use my current GPS location</span>
            </button>

            <div className="space-y-2">
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder="Enter city or neighborhood..."
                className="w-full bg-white border border-[#e6e8ec] rounded-xl px-3.5 py-2.5 text-xs text-[#0A1931] outline-none focus:border-[#0f2f63]"
              />

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {["Chennai, TN", "Royapuram, Chennai, TN", "Bengaluru, KA", "Koramangala, Bengaluru", "Hyderabad, TS", "Mumbai, MH", "Pune, MH", "Delhi NCR"].map((loc) => (
                  <div
                    key={loc}
                    onClick={() => {
                      const parts = loc.split(',');
                      if (parts.length > 2) {
                        setArea(parts[0].trim());
                        setCity(parts[1].trim());
                      } else {
                        setCity(parts[0].trim());
                      }
                      setIsCityModalOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#f4f4f4] text-xs font-semibold text-[#0A1931] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#0f2f63]" />
                    <span>{loc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Resume Modal */}
      <CandidateResumeModal
        isOpen={showResumeModal}
        onClose={() => {
          setShowResumeModal(false);
          navigate("/search");
        }}
        data={generatedResumeData}
      />
    </div>
  );
}
