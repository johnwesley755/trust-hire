import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { 
  User, 
  MapPin, 
  IndianRupee, 
  Sparkles, 
  Check, 
  Loader2, 
  LocateFixed, 
  AlertCircle,
  Clock,
  ArrowRight,
  HelpCircle,
  LogOut
} from "lucide-react";
import { UserAvatar } from "../../../components/common/UserAvatar";

const POPULAR_TRADES = [
  "Electrician",
  "Plumber",
  "Warehouse Associate",
  "Delivery Driver",
  "Welder",
  "Carpenter",
  "Mason",
  "Facility & Cleaning",
  "Painter",
  "Mechanic",
  "General Labor"
];

const EXPERIENCE_OPTIONS = [
  { label: "Fresher (< 1 year)", value: 0 },
  { label: "1 - 2 years", value: 2 },
  { label: "3 - 5 years", value: 4 },
  { label: "5+ years", value: 6 }
];

export default function WorkerOnboardingPage() {
  const { user } = useUser();
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber || (user as any)?.phone_number || ""
  );
  const [skills, setSkills] = useState<string[]>(["Electrician"]);
  const [customSkill, setCustomSkill] = useState("");
  const [experienceYears, setExperienceYears] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(350);
  const [city, setCity] = useState(user?.location || "Bengaluru");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [bio, setBio] = useState("");
  
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasSynced = useRef(false);

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
    }
  }, [freshUser, fullName, phoneNumber, updateUser]);

  const handleToggleTrade = (trade: string) => {
    if (skills.includes(trade)) {
      if (skills.length > 1) {
        setSkills(skills.filter(s => s !== trade));
      }
    } else {
      setSkills([...skills, trade]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkill.trim()) {
      e.preventDefault();
      const val = customSkill.trim();
      if (!skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setCustomSkill("");
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Detecting coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setLatitude(lat);
        setLongitude(lon);

        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const addr = geoData.address;
            const detectedCity = addr.city || addr.town || addr.suburb || addr.state_district || city;
            const detectedArea = [addr.suburb || addr.neighbourhood, detectedCity].filter(Boolean).join(', ');
            setCity(detectedCity);
            setAddress(detectedArea);
            setLocationStatus(`GPS Live: ${detectedArea}`);
          } else {
            setLocationStatus(`GPS Live (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
          }
        } catch {
          setLocationStatus(`GPS Live (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        setLocationStatus("GPS access denied");
        alert("Please allow location access to auto-fill your neighborhood.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please provide a valid 10-digit mobile number.");
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (skills.length === 0) {
      setErrorMessage("Please select at least one primary trade skill.");
      return;
    }

    setIsSubmitting(true);

    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || 'Worker';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 1. Sync user basic metadata
      await apiClient.post('/api/auth/sync', {
        role: 'WORKER',
        first_name: firstName,
        last_name: lastName,
        phone_number: cleanPhone,
        city,
        location: address || city,
        onboarded: true
      });

      // 2. Put Worker Profile details (including unique phone validation in backend)
      await apiClient.put('/api/worker/profile', {
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        bio: bio.trim() || `${skills.join(', ')} specialist with ${experienceYears} years experience in ${city}.`,
        skills: skills.join(", "),
        experienceYears: Number(experienceYears) || 1,
        hourlyRate: Number(hourlyRate) || 350,
        level: 'L1',
        location: address || city,
        address: address || city,
        city,
        latitude,
        longitude,
        isAvailable: true
      });

      localStorage.setItem('onboarded', 'true');
      updateUser({
        ...user,
        onboarded: true,
        phoneNumber: cleanPhone,
        firstName,
        lastName,
      });

      navigate("/search");
    } catch (error: any) {
      console.error("Worker onboarding error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to save profile. Please check your phone number.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1931] font-sans antialiased flex flex-col justify-between selection:bg-blue-100">
      
      {/* Sticky Top Header with TrustHyre Logo */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="TrustHyre Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#0A1931] leading-none">
                Trust<span className="text-[#0066FF]">Hyre</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider mt-0.5">HYPER-LOCAL MARKETPLACE</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-600">
            <Link to="/help" className="hover:text-[#0066FF] flex items-center gap-1.5 transition-colors">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Help & Support</span>
            </Link>
            <button 
              onClick={logout} 
              className="hover:text-red-600 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Page Form Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0066FF] rounded-full text-xs font-bold border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" /> Fast Onboarding
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
              Complete Your Worker Profile
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              Provide your basic trade details and mobile number to start getting matched with instant local shifts.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-xs sm:text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <div>
                <p className="font-bold">Setup Error</p>
                <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Single Page Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="shrink-0">
                <UserAvatar
                  src={user?.profileImageUrl}
                  name={fullName || user?.firstName}
                  size="lg"
                />
              </div>
              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your legal full name"
                      className="w-full pl-9.5 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0A1931] focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Mobile Phone Number *</label>
                    <span className="text-[10px] text-slate-400 font-medium">10-Digit Mobile</span>
                  </div>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-500 absolute left-3 top-2.5">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0A1931] focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Required for employer calls and prevents duplicate accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Trade / Skills Selection */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">
                  Primary Trade Skills * ({skills.length} selected)
                </label>
                <span className="text-[10px] text-slate-400">Select all that apply</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {POPULAR_TRADES.map((trade) => {
                  const isSelected = skills.includes(trade);
                  return (
                    <button
                      type="button"
                      key={trade}
                      onClick={() => handleToggleTrade(trade)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#0066FF] text-white border-[#0066FF] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-[#0066FF]"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {trade}
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Input */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={handleAddCustomSkill}
                  placeholder="Type additional skill and press Enter..."
                  className="w-full px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>
            </div>

            {/* Experience & Expected Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Experience Level
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    placeholder="Years of experience"
                    className="w-full pl-9.5 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0A1931] focus:ring-2 focus:ring-[#0066FF] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hourly Rate Expectation (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full pl-9.5 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0A1931] focus:ring-2 focus:ring-[#0066FF] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location & GPS Area */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">
                  Work Location & City
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
                  {isLocating ? "Detecting..." : "Detect my GPS location"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Bengaluru)"
                    className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0A1931] focus:ring-2 focus:ring-[#0066FF] outline-none"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Area / Neighborhood (e.g. Koramangala)"
                    className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-[#0A1931] focus:ring-2 focus:ring-[#0066FF] outline-none"
                  />
                </div>
              </div>

              {locationStatus && (
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {locationStatus}
                </p>
              )}
            </div>

            {/* Bio / Summary (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Bio / Experience Summary (Optional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="E.g. Certified technician specializing in residential wiring, appliance installation, and quick shift maintenance."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-[#0066FF] outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  Complete Profile & Find Shifts
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TrustHyre Logo" className="w-5 h-5 object-contain" />
            <span className="font-semibold text-slate-700">© 2026 TrustHyre Technologies. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link to="/privacy" className="hover:text-[#0066FF] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#0066FF] transition-colors">Terms of Service</Link>
            <Link to="/help" className="hover:text-[#0066FF] transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
