import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../core/api/apiClient";
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck,
  Target,
  Navigation,
  Loader2
} from "lucide-react";

const INDUSTRY_OPTIONS = [
  "Construction", "Facility Management", "Retail", "Hospitality", 
  "Manufacturing", "Logistics", "Personal Services", "Technology"
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companyWebsite: "",
    profileBio: "",
    businessAddress: "",
    city: "",
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
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            businessAddress: "Detecting location..."
          }));

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            
            const address = data.display_name;
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Unknown City";
            
            setFormData(prev => ({
              ...prev,
              businessAddress: address,
              city: city
            }));
            setLocationError("");
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setFormData(prev => ({
              ...prev,
              businessAddress: "Detected (Manual fix needed)"
            }));
          }
        },
        (err) => {
          setLocationError("Access denied. Please enter manually.");
          console.error(err);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.put('/api/employer/profile', {
          companyName: formData.companyName,
          industry: formData.industry,
          companyWebsite: formData.companyWebsite,
          profileBio: formData.profileBio,
          businessTier: "BASIC",
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.businessAddress,
          city: formData.city || ""
      });

      await apiClient.post('/api/auth/sync', { role: "EMPLOYER", onboarded: true });
      localStorage.setItem('onboarded', 'true');
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding failure:", error);
      alert("Verification sync failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 selection:bg-brand-primary selection:text-brand-secondary">
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      {/* Progress Bar */}
      <div className="max-w-md w-full mb-12 flex gap-3 relative z-10">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
              step >= i ? "bg-brand-primary shadow-lg shadow-brand-primary/20" : "bg-brand-border"
            }`} 
          />
        ))}
      </div>

      <div className="max-w-lg w-full bg-brand-surface rounded-[3rem] shadow-2xl border border-brand-border p-10 space-y-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary/20" />
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-secondary text-brand-primary rounded-[2rem] flex items-center justify-center shadow-xl">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                   <h1 className="text-4xl font-bold tracking-tight text-brand-secondary leading-tight">Welcome</h1>
                   <p className="text-brand-primary text-xs font-semibold uppercase tracking-widest mt-1">Profile Setup</p>
                </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Company Name</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-white border border-brand-border rounded-2xl p-5 font-medium focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/20"
                  placeholder="e.g. Reliance Logistics"
                />
               </div>
               <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Website (Optional)</label>
                <input 
                  type="text" 
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                  className="w-full bg-white border border-brand-border rounded-2xl p-5 font-medium focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/20"
                  placeholder="https://company.com"
                />
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-primary text-brand-secondary rounded-4xl flex items-center justify-center shadow-xl">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                   <h1 className="text-4xl font-bold tracking-tight text-neutral-900 leading-tight">Industry</h1>
                   <p className="text-brand-primary text-xs font-semibold uppercase tracking-widest mt-1">Business Sector</p>
                </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1 mb-2 block">Choose Industry</label>
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRY_OPTIONS.map(industry => (
                  <button
                    key={industry}
                    onClick={() => setFormData({...formData, industry})}
                    className={`px-4 py-4 rounded-2xl text-xs font-bold transition-all uppercase tracking-widest border-2 ${
                      formData.industry === industry
                        ? "bg-brand-secondary text-brand-primary border-brand-secondary shadow-xl shadow-brand-secondary/10"
                        : "bg-white text-brand-muted border-brand-border hover:border-brand-primary/50"
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Company Bio</label>
                <textarea 
                  rows={3}
                  value={formData.profileBio}
                  onChange={(e) => setFormData({...formData, profileBio: e.target.value})}
                  className="w-full bg-white border border-brand-border rounded-2xl p-5 font-medium focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/20"
                  placeholder="Provide a brief overview of your business..."
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-accent text-white rounded-4xl flex items-center justify-center shadow-xl">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                   <h1 className="text-4xl font-bold tracking-tight text-neutral-900 leading-tight">Location</h1>
                   <p className="text-brand-primary text-xs font-semibold uppercase tracking-widest mt-1">Primary Headquarters</p>
                </div>
            </div>

            <div className="space-y-6">
              <button 
                onClick={detectLocation}
                className="w-full bg-neutral-900 text-brand-primary font-semibold p-5 rounded-4xl flex items-center justify-center gap-3 border-2 border-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all shadow-xl"
              >
                <Navigation className="w-6 h-6" /> Use Current Location
              </button>
              <div className="text-center text-[10px] font-medium text-brand-border uppercase tracking-[0.5em]">Manual Entry</div>
              <div className="space-y-2">
                 <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Business Address</label>
                 <textarea 
                    rows={2}
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    className="w-full bg-white border border-brand-border rounded-2xl p-5 font-medium focus:border-brand-primary focus:outline-none transition-all placeholder:text-brand-muted/20"
                    placeholder="Enter full address"
                 />
              </div>
              {locationError && <p className="text-brand-accent text-xs font-black italic">{locationError}</p>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 pt-10">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 bg-white text-brand-secondary font-semibold py-5 rounded-4xl border-2 border-brand-border active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          )}
          
          <button 
            onClick={step < 3 ? nextStep : handleSubmit}
            disabled={isSubmitting}
            className={`flex-2 bg-brand-secondary text-brand-primary font-semibold py-5 rounded-4xl flex items-center justify-center gap-3 shadow-2xl shadow-brand-secondary/20 active:scale-95 transition-all text-xs uppercase tracking-widest ${
              isSubmitting ? "opacity-70" : ""
            }`}
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                    {step < 3 ? "Next Step" : "Complete Setup"}
                    <ChevronRight className="w-5 h-5" />
                </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3 text-brand-muted font-medium text-xs uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4 text-brand-primary" /> Secure Identity Verification
      </div>
    </div>
  );
}

