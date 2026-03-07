import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  User, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Zap,
  Hammer,
  ShieldCheck,
  Navigation
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const SKILL_OPTIONS = [
  "Carpentry", "Plumbing", "Electrical", "Masonry", "Painting",
  "Cleaning", "Gardening", "Cooking", "Driving", "General Labor"
];

export default function OnboardingPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: "",
    skills: [] as string[],
    experienceYears: 0,
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            location: "Current Location (GPS Detected)"
          }));
          setLocationError("");
        },
        (err) => {
          setLocationError("Could not detect location. Please type it.");
          console.error(err);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      
      // 1. Update Worker Profile
      await axios.put(
        `${API_URL}/api/worker/profile`,
        {
          fullName: formData.fullName,
          bio: formData.bio,
          skills: formData.skills.join(", "),
          experienceYears: formData.experienceYears,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          isAvailable: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Mark as Onboarded in Auth Service
      // We'll create a new internal endpoint for this or just do it in the sync endpoint
      await axios.post(
          `${API_URL}/auth/sync`, 
          { onboarded: true }, 
          { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 pb-12">
      {/* Progress Bar */}
      <div className="max-w-md w-full mb-8 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              step >= i ? "bg-indigo-600 shadow-sm" : "bg-slate-200"
            }`} 
          />
        ))}
      </div>

      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 p-8 space-y-6">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome to TrustHire!</h1>
              <p className="text-slate-500 font-medium">Let's get your profile ready to find high-paying jobs.</p>
            </div>
            <div className="space-y-4">
               <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="e.g. Rahul Sharma"
                />
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Expertise</h1>
              <p className="text-slate-500 font-medium">What kind of work are you looking for?</p>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Choose Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      formData.skills.includes(skill)
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600"
                        : "bg-slate-50 text-slate-600 border-2 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Experience (Years)</label>
                <input 
                  type="number" 
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
              <Hammer className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">About You</h1>
              <p className="text-slate-500 font-medium">Write a short bio to attract employers.</p>
            </div>
            <div className="space-y-4">
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. Master carpenter with 10 years experience in modular kitchen design..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Location</h1>
              <p className="text-slate-500 font-medium">We'll find jobs near you.</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={detectLocation}
                className="w-full bg-indigo-50 text-indigo-600 font-black p-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                <Navigation className="w-5 h-5" /> Use My Current Location
              </button>
              <div className="text-center text-xs font-bold text-slate-300">OR</div>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                placeholder="Type your city/area..."
              />
              {locationError && <p className="text-rose-500 text-xs font-bold">{locationError}</p>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 bg-slate-100 text-slate-600 font-black p-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-slate-100 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          )}
          
          <button 
            onClick={step < 4 ? nextStep : handleSubmit}
            disabled={isSubmitting}
            className={`flex-2 bg-indigo-600 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 active:scale-95 transition-all ${
              isSubmitting ? "opacity-70" : ""
            }`}
          >
            {isSubmitting ? "Finishing..." : (step < 4 ? <>Continue <ChevronRight className="w-5 h-5" /></> : "Get Started!")}
          </button>
        </div>

      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure & Verified by TrustHire
      </div>
    </div>
  );
}
