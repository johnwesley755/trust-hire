import { useState } from "react";
import { useUser } from "../../../core/providers/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../../core/api/apiClient";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";

// Modular Step Components
import IdentityStep from "../components/onboarding/IdentityStep";
import ExpertiseStep from "../components/onboarding/ExpertiseStep";
import DocumentsStep from "../components/onboarding/DocumentsStep";
import ReviewStep from "../components/onboarding/ReviewStep";

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    bio: "",
    skills: [] as string[],
    experienceYears: "",
    hourlyRate: "",
    level: "L1",
    location: "",
    city: "South Mumbai",
    latitude: null as number | null,
    longitude: null as number | null,
    profile_image_url: (user as { profile_image_url?: string })?.profile_image_url || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");

  const nextStep = () => {
    if (step < 4) setStep(s => s + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({ ...prev, latitude, longitude, location: "Detecting address..." }));

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            const address = data.display_name;
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Unknown City";
            
            setFormData(prev => ({ ...prev, location: address, city: city }));
            setLocationError("");
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setFormData(prev => ({ ...prev, location: "Location detected (Address fetch failed)" }));
          }
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
      await apiClient.put(
        '/api/worker/profile',
        {
          fullName: formData.fullName,
          bio: formData.bio,
          skills: formData.skills.join(", "),
          experienceYears: Number(formData.experienceYears),
          hourlyRate: Number(formData.hourlyRate),
          level: formData.level,
          location: formData.location,
          address: formData.location,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          isAvailable: true
        }
      );
      navigate("/verify-identity");
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F4EF] font-body text-[#1F3F34] min-h-screen flex flex-col selection:bg-[#FACD15] selection:text-[#002117] antialiased bricolage relative overflow-hidden">
        {/* Persistent Background Organic Blobs */}
        <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-[#FACD15]/10 organic-blob -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#c7ebdb]/15 organic-blob -z-10"></div>
        {/* TopAppBar */}
        <header className="bg-[#F5F4EF]/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full border-b border-[#1F3F34]/5">
            <div className="text-lg font-headline font-black tracking-tight leading-tight text-[#1F3F34]">
                TrustHire
            </div>
            
            {/* Desktop Stepper */}
            <div className="hidden md:flex gap-8 items-center">
                <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === 1 ? 'bg-[#FACD15] text-[#002117]' : 'bg-[#1F3F34]/10 text-[#1F3F34]/60'}`}>01</span>
                    <span className={`font-headline font-bold text-sm transition-all ${step === 1 ? 'text-[#1F3F34] border-b-2 border-[#FACD15]' : 'text-[#1F3F34]/60'}`}>Profile</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === 2 ? 'bg-[#FACD15] text-[#002117]' : 'bg-[#1F3F34]/10 text-[#1F3F34]/60'}`}>02</span>
                    <span className={`font-headline font-bold text-sm transition-all ${step === 2 ? 'text-[#1F3F34] border-b-2 border-[#FACD15]' : 'text-[#1F3F34]/60'}`}>Expertise</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === 3 ? 'bg-[#FACD15] text-[#002117]' : 'bg-[#1F3F34]/10 text-[#1F3F34]/60'}`}>03</span>
                    <span className={`font-headline font-bold text-sm transition-all ${step === 3 ? 'text-[#1F3F34] border-b-2 border-[#FACD15]' : 'text-[#1F3F34]/60'}`}>Documents</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step === 4 ? 'bg-[#FACD15] text-[#002117]' : 'bg-[#1F3F34]/10 text-[#1F3F34]/60'}`}>04</span>
                    <span className={`font-headline font-bold text-sm transition-all ${step === 4 ? 'text-[#1F3F34] border-b-2 border-[#FACD15]' : 'text-[#1F3F34]/60'}`}>Review</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="hover:bg-[#FACD15]/10 p-2 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-[#1F3F34]">help_outline</span>
                </button>
            </div>
        </header>

        <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-12">
            {/* Progress Stepper for Mobile/Tablet */}
            <div className="md:hidden mb-12">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-headline text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Step 0{step} of 04</span>
                    <span className="font-headline text-[10px] font-bold text-[#FACD15] uppercase tracking-widest">
                        {step === 1 ? 'Profile' : step === 2 ? 'Expertise' : step === 3 ? 'Documents' : 'Review'}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-[#E9E8E3] rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: "25%" }}
                        animate={{ width: `${step * 25}%` }}
                        className="h-full bg-[#FACD15]"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <IdentityStep 
                        key="step1"
                        formData={formData}
                        setFormData={setFormData}
                        onNext={nextStep}
                    />
                )}

                {step === 2 && (
                    <ExpertiseStep 
                        key="step2"
                        formData={formData}
                        setFormData={setFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {step === 3 && (
                    <DocumentsStep 
                        key="step3"
                        formData={formData}
                        setFormData={setFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}

                {step === 4 && (
                    <ReviewStep 
                        key="step4"
                        formData={formData}
                        setFormData={setFormData}
                        onBack={prevStep}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        detectLocation={detectLocation}
                        locationError={locationError}
                    />
                )}
            </AnimatePresence>
        </main>

        {/* Global Footer */}
        <footer className="bg-[#F5F4EF] py-16 px-6 mt-auto border-t border-[#1F3F34]/5">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="font-headline font-black text-xl text-[#1F3F34] tracking-tighter">TrustHire</div>
                <div className="text-sm font-medium text-[#1F3F34]/60">
                    © 2024 TrustHire. Human-First Onboarding.
                </div>
                <div className="flex gap-10">
                    <Link className="text-[#1F3F34]/60 hover:text-[#FACD15] transition-colors text-xs font-bold uppercase tracking-widest" to="/privacy">Privacy</Link>
                    <Link className="text-[#1F3F34]/60 hover:text-[#FACD15] transition-colors text-xs font-bold uppercase tracking-widest" to="/support">Support</Link>
                    <Link className="text-[#1F3F34]/60 hover:text-[#FACD15] transition-colors text-xs font-bold uppercase tracking-widest" to="/terms">Terms</Link>
                </div>
            </div>
        </footer>

        <style>{`
            .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
            .organic-blob {
                border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
                -webkit-appearance: none; 
                margin: 0; 
            }
        `}</style>
    </div>
  );
}
