import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
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
  Globe2,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Camera,
  UploadCloud,
  Image as ImageIcon
} from "lucide-react";
import { CandidateResumeModal } from "../components/resume/CandidateResumeModal";
import type { ResumeData } from "../components/resume/CandidateResumeView";

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

export default function WorkerOnboardingPage() {
  const { user } = useUser();
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Wizard Step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State matching Static-Images
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

  // Step 6: Preferred Job Roles & Skills
  const [preferredRoles, setPreferredRoles] = useState<string[]>(["Cook / Chef / Kitchen Help", "Retail Sales & Operations"]);
  const [roleSearchInput, setRoleSearchInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>(["Electrician", "Customer Support"]);

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
          setIsUploadingPhoto(false);
        } else {
          setProfileImageUrl(event.target?.result as string);
          setIsUploadingPhoto(false);
        }
      };
      img.onerror = () => {
        setErrorMessage("Failed to process image file. Please try another.");
        setIsUploadingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read file.");
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // GPS Auto-Detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLatitude(lat);
        setLongitude(lng);

        try {
          // Reverse geocode via free OSM Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`
          );
          const data = await res.json();
          const detectedCity = data.address?.city || data.address?.state_district || data.address?.town || data.address?.county || "Chennai";
          const detectedArea = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || data.address?.road || "";
          
          if (detectedCity) setCity(detectedCity);
          if (detectedArea) setArea(detectedArea);
          setAddress(`${detectedArea ? detectedArea + ', ' : ''}${detectedCity}`);
        } catch {
          setCity("Chennai");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setErrorMessage("Could not detect precise GPS location. Please select city manually.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Toggle Language Pill
  const handleToggleLanguage = (lang: string) => {
    if (languagesKnown.includes(lang)) {
      setLanguagesKnown(languagesKnown.filter(l => l !== lang));
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

    const resumeData: ResumeData = {
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      email: email,
      profileImageUrl: profileImageUrl || undefined,
      city: city,
      area: area,
      location: fullLoc,
      bio: `${preferredRoles.join(', ')} professional based in ${fullLoc}. Proficient in ${englishProficiency.toLowerCase()} English and ${languagesKnown.join(', ')}.`,
      highestEducation,
      isPursuingEducation,
      collegeName: collegeName.trim() || undefined,
      degree: degree || undefined,
      specialization: specialization.trim() || undefined,
      schoolMedium: schoolMedium || undefined,
      englishProficiency,
      languagesKnown,
      skills: [...new Set([...skills, ...preferredRoles])],
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

      // 2. Put Detailed Worker Profile (Lakebase Postgres)
      await apiClient.put('/api/worker/profile', {
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        profileImageUrl: profileImageUrl,
        profile_image_url: profileImageUrl,
        profilePhoto: profileImageUrl,
        bio: resumeData.bio,
        skills: resumeData.skills ? (resumeData.skills as string[]).join(', ') : '',
        experienceYears: 1,
        hourlyRate: 350,
        level: 'L1',
        location: fullLoc,
        address: address || fullLoc,
        city,
        area,
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
        preferredRoles
      });

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
    <div className="min-h-screen bg-[#F0F2F6] font-sans flex flex-col justify-between p-3 sm:p-6 md:p-10">
      
      {/* Top Main Navbar Branding */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 px-4 mb-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="TrustHyre" className="w-8 h-8 object-contain" />
          <span className="text-xl font-black text-[#0A1931]">
            Trust<span className="text-[#0066FF]">Hyre</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </header>

      {/* Main Container Card */}
      <main className="max-w-6xl w-full mx-auto bg-white rounded-3xl md:rounded-[32px] shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] transition-all">
        
        {/* Left Side: Brand Visual Hero matching Static Images */}
        <div className="md:col-span-5 bg-linear-to-b from-[#0066FF] to-[#0047BA] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase border border-white/20">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Direct Job Matching
            </span>
          </div>

          {/* Center Card Visual */}
          <div className="relative z-10 my-auto py-6">
            <h2 className="text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif] leading-tight mb-4">
              Complete <br />your profile!
            </h2>

            {/* Value Propositions with Checkmarks */}
            <div className="space-y-3.5 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 mb-6">
              <div className="flex items-center gap-3 text-xs font-semibold text-white/95">
                <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-900 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <span>Personalised job matches in your area</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-white/95">
                <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-900 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <span>Direct connect with HRs & recruiters</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-white/95">
                <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-900 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <span>Latest verified updates on candidate offers</span>
              </div>
            </div>

            {/* Professional Candidate Visual Stamp */}
            <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
              <div className="w-12 h-12 rounded-xl bg-white text-[#0066FF] flex items-center justify-center font-black text-lg shadow-md">
                <ShieldCheck className="w-7 h-7 text-[#0066FF]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">TrustHyre Verified CV</p>
                <p className="text-[11px] text-sky-100">Automatically built and shared with top companies</p>
              </div>
            </div>
          </div>

          {/* Social Proof Marquee Footer */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <p className="text-[11px] font-semibold text-sky-100 mb-2">
              Trusted by over 2,500+ top enterprises
            </p>
            <div className="flex items-center justify-between text-xs font-extrabold text-white/70 tracking-wider">
              <span>Paytm</span>
              <span>•</span>
              <span>Uber</span>
              <span>•</span>
              <span>Zomato</span>
              <span>•</span>
              <span>TATA</span>
              <span>•</span>
              <span>Dunzo</span>
            </div>
          </div>
        </div>

        {/* Right Side: Multi-Step Interactive Form */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-white">
          
          {/* Top Progress Bar & Step Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <span className="text-xs font-bold text-slate-800 font-['Outfit',sans-serif]">
                  {currentStep === 1 && "Basic Details"}
                  {currentStep === 2 && "Personal Demographics"}
                  {currentStep === 3 && "Location Details"}
                  {currentStep === 4 && "Education Details"}
                  {currentStep === 5 && "Preferred Language"}
                  {currentStep === 6 && "Preferred Job Role"}
                </span>
              </div>
              <span className="text-xs font-bold text-[#0066FF]">
                Step {currentStep} of 6
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
              <div 
                className="bg-[#0066FF] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Step 1: Basic Details & Highest Education */}
          {currentStep === 1 && (
            <div className="space-y-6 my-auto py-2">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">
                  Tell us your full name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name (e.g. John Wesley)"
                  required
                  className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                />
              </div>

              {/* Mandatory Candidate Profile Photo Upload */}
              <div className="space-y-2 p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 font-['Outfit',sans-serif] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#0066FF]" />
                    Candidate Profile Photo *
                  </label>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    Mandatory for Verification
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-500">
                  Employers prefer candidates with a clear profile photo. If signed in with Google, your avatar is automatically linked.
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
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6 mb-1" />
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
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        {isUploadingPhoto ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066FF]" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5 text-[#0066FF]" />
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
                    <p className="text-[10px] text-slate-400 font-medium">
                      Supports JPG, PNG, WEBP (Max 10MB, auto-compressed)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-800 font-['Outfit',sans-serif]">
                    What is your highest level of education? *
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select highest education level even if not completed
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EDUCATION_LEVELS.map((edu) => (
                    <button
                      key={edu}
                      type="button"
                      onClick={() => setHighestEducation(edu)}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                        highestEducation === edu
                          ? "bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fastrack Banner Card */}
              <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md mb-0.5">
                      ⚡ Takes less than 2 minutes
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      Have Resume / LinkedIn profile?
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Fastrack your verified profile creation
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>Fastrack</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Continue to Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Personal Demographics & Contact */}
          {currentStep === 2 && (
            <div className="space-y-4 my-auto py-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                    Date of Birth (DOB) *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                    Gender *
                  </label>
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          gender === g
                            ? "bg-blue-50 text-[#0066FF] border-[#0066FF]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@gmail.com"
                  className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                    Mobile Phone Number *
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">10-Digit Mobile</span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-1 text-slate-600 font-bold text-xs pointer-events-none select-none border-r border-slate-200 pr-2 z-10">
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
                    className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl pl-16 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                  />
                </div>
              </div>

              {/* WhatsApp Opt-in Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="mt-0.5 rounded text-[#0066FF] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium leading-tight">
                  Send me important job offers, interview alerts, and employer calls on WhatsApp
                </span>
              </label>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 3: Location Details & Hyperlocal Area */}
          {currentStep === 3 && (
            <div className="space-y-5 my-auto py-2">
              <div className="text-center py-2">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <MapPin className="w-7 h-7 text-rose-500" />
                </div>
                <h3 className="text-base font-extrabold text-[#0A1931] font-['Outfit',sans-serif]">
                  Discover the best jobs near you
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Please share your current location to match verified jobs in your neighborhood
                </p>
              </div>

              {/* Location Selector Cards */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                  <span>{isLocating ? "Detecting GPS location..." : "Pick current GPS location"}</span>
                </button>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Selected Location:</span>
                    <button
                      type="button"
                      onClick={() => setIsCityModalOpen(true)}
                      className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{area ? `${area}, ` : ''}{city}, India</span>
                  </div>
                </div>
              </div>

              {/* Relocation Preference */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 font-['Outfit',sans-serif]">
                  Would you also like to explore jobs outside {city}?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWillingToRelocate(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      willingToRelocate
                        ? "bg-blue-50 text-[#0066FF] border-[#0066FF]"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setWillingToRelocate(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      !willingToRelocate
                        ? "bg-blue-50 text-[#0066FF] border-[#0066FF]"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    No
                  </button>
                </div>

                {willingToRelocate && (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Preferred Regions / Cities:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_REGIONS.map((reg) => (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => handleToggleRegion(reg)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            preferredCities.includes(reg)
                              ? "bg-[#0066FF] text-white border-[#0066FF]"
                              : "bg-white text-slate-700 border-slate-200"
                          }`}
                        >
                          {reg} {preferredCities.includes(reg) ? "✓" : "+"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 4: Education Details Deep Dive */}
          {currentStep === 4 && (
            <div className="space-y-4 my-auto py-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 font-['Outfit',sans-serif]">
                  Are you currently pursuing your education? *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPursuingEducation(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isPursuingEducation
                        ? "bg-blue-50 text-[#0066FF] border-[#0066FF]"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPursuingEducation(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      !isPursuingEducation
                        ? "bg-blue-50 text-[#0066FF] border-[#0066FF]"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Conditional Form fields based on Education Level */}
              {highestEducation.includes("Graduate") || highestEducation === "Diploma" || highestEducation === "ITI" ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                      College / Institute Name
                    </label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. Govt ITI Chennai / Loyola College"
                      className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                        Degree / Qualification
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                      >
                        {DEGREE_OPTIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                        Specialization / Major
                      </label>
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="e.g. Electrical / Computer Science"
                        className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                      School Medium
                    </label>
                    <select
                      value={schoolMedium}
                      onChange={(e) => setSchoolMedium(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                    >
                      {SCHOOL_MEDIUMS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={nextStep}
                className="w-full mt-4 bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 5: Language Matrix */}
          {currentStep === 5 && (
            <div className="space-y-5 my-auto py-2">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 font-['Outfit',sans-serif]">
                  English Proficiency Level *
                </label>
                <div className="space-y-2">
                  {ENGLISH_LEVELS.map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setEnglishProficiency(lvl.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        englishProficiency === lvl.id
                          ? "border-[#0066FF] bg-blue-50/60 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <p className={`text-xs font-bold ${englishProficiency === lvl.id ? "text-[#0066FF]" : "text-slate-800"}`}>
                          {lvl.label}
                        </p>
                        <p className="text-[11px] text-slate-500">{lvl.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        englishProficiency === lvl.id ? "border-[#0066FF] bg-[#0066FF]" : "border-slate-300"
                      }`}>
                        {englishProficiency === lvl.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Indian Languages */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-800 font-['Outfit',sans-serif]">
                    Add other languages you can speak (Optional)
                  </label>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                  {POPULAR_LANGUAGES.map((lang) => {
                    const isSelected = languagesKnown.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleToggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-700 border-emerald-400"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {lang} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 6: Preferred Job Roles & Target Trades */}
          {currentStep === 6 && (
            <div className="space-y-5 my-auto py-2">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">
                  What kind of job are you looking for? *
                </label>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={roleSearchInput}
                    onChange={(e) => setRoleSearchInput(e.target.value)}
                    onKeyDown={handleAddCustomRole}
                    placeholder="Search by job title or role (Press Enter to add)..."
                    className="w-full bg-slate-50/70 border border-slate-200 focus:border-[#0066FF] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold outline-none"
                  />
                </div>

                {/* Selected Roles Container */}
                {preferredRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {preferredRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#0066FF] border border-blue-200"
                      >
                        <span>{role}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleRole(role)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Suggested Job Roles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>AI Suggested Job Roles</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-1">
                  {POPULAR_JOB_ROLES.map((role) => {
                    const isSelected = preferredRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleToggleRole(role)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-[#0066FF] text-white border-[#0066FF]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {role} {isSelected ? "✓" : "+"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitProfile}
                disabled={isSubmitting || preferredRoles.length === 0}
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Verified Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Profile & View Verified Resume</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bottom Progress Footnote */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Verified Candidate Network</span>
            <span>Step {currentStep} of 6</span>
          </div>
        </div>
      </main>

      {/* City Search Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit',sans-serif]">Search your city</h3>
              <button
                type="button"
                onClick={() => setIsCityModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
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
              className="w-full p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200 cursor-pointer"
            >
              <LocateFixed className="w-4 h-4 text-emerald-600" />
              <span>Use my current location</span>
            </button>

            <div className="space-y-2">
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder="Enter city or neighborhood..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#0066FF]"
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
                    className="p-2.5 rounded-xl hover:bg-slate-100 text-xs font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
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
