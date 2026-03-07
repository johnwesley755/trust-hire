import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  Target,
  Navigation
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const INDUSTRY_OPTIONS = [
  "Construction", "Facility Management", "Retail", "Hospitality", 
  "Manufacturing", "Logistics", "Personal Services", "Technology"
];

export default function OnboardingPage() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companyWebsite: "",
    profileBio: "",
    businessAddress: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            businessAddress: "Current Location (GPS Detected)"
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
      
      // 1. Update Employer Profile in employer-service
      await axios.put(
        `${API_URL}/api/employer/profile`,
        {
          companyName: formData.companyName,
          industry: formData.industry,
          companyWebsite: formData.companyWebsite,
          profileBio: formData.profileBio,
          businessTier: "BASIC",
          latitude: formData.latitude,
          longitude: formData.longitude
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Mark as Onboarded in Auth Service
      await axios.post(
          `${API_URL}/auth/sync`, 
          { role: "EMPLOYER", onboarded: true }, 
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
        {[1, 2, 3].map((i) => (
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
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome, Employer!</h1>
              <p className="text-slate-500 font-medium">Let's set up your business profile to start hiring.</p>
            </div>
            <div className="space-y-4">
               <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Company Name</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="e.g. Acme Constructions"
                />
               </div>
               <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Company Website (Optional)</label>
                <input 
                  type="text" 
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="https://acme.com"
                />
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Business Details</h1>
              <p className="text-slate-500 font-medium">Which industry do you operate in?</p>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Industry</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_OPTIONS.map(industry => (
                  <button
                    key={industry}
                    onClick={() => setFormData({...formData, industry})}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      formData.industry === industry
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600"
                        : "bg-slate-50 text-slate-600 border-2 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">About Your Business</label>
                <textarea 
                  rows={3}
                  value={formData.profileBio}
                  onChange={(e) => setFormData({...formData, profileBio: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="We are a leader in residential construction..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Headquarters</h1>
              <p className="text-slate-500 font-medium">Where is your business located?</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={detectLocation}
                className="w-full bg-indigo-50 text-indigo-600 font-black p-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                <Navigation className="w-5 h-5" /> Detect Headquarters Location
              </button>
              <div className="text-center text-xs font-bold text-slate-300">OR</div>
              <input 
                type="text" 
                value={formData.businessAddress}
                onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold focus:border-indigo-500 focus:outline-none transition-all"
                placeholder="e.g. Bandra West, Mumbai"
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
            onClick={step < 3 ? nextStep : handleSubmit}
            disabled={isSubmitting}
            className={`flex-2 bg-indigo-600 text-white font-black p-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 active:scale-95 transition-all ${
              isSubmitting ? "opacity-70" : ""
            }`}
          >
            {isSubmitting ? "Finalizing..." : (step < 3 ? <>Continue <ChevronRight className="w-5 h-5" /></> : "Start Hiring")}
          </button>
        </div>

      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-500" /> TrustHire Verified Business Network
      </div>
    </div>
  );
}
