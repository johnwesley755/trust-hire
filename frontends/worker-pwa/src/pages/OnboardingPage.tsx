import { useState } from "react";
import { useUser } from "../providers/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { 
  User, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Zap,
  Hammer,
  ShieldCheck,
  Navigation,
  CheckCircle2,
  Briefcase,
  Star,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../hooks/useLanguage";

const SKILL_OPTIONS = [
  "Carpentry", "Plumbing", "Electrical", "Masonry", "Painting",
  "Cleaning", "Gardening", "Cooking", "Driving", "General Labor"
];

const STEPS = [
  { id: 1, title: "Identity", icon: User },
  { id: 2, title: "Expertise", icon: Star },
  { id: 3, title: "Narrative", icon: Briefcase },
  { id: 4, title: "Base", icon: MapPin },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    bio: "",
    skills: [] as string[],
    experienceYears: "",
    hourlyRate: "",
    level: "L1",
    location: "",
    city: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState("");

  const nextStep = () => {
    if (step === 2 && (formData.experienceYears === "" || formData.hourlyRate === "")) {
      alert("Please specify experience and rate to continue.");
      return;
    }
    setStep(s => s + 1);
  };
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
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            location: "Detecting address..."
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
              location: address,
              city: city
            }));
            setLocationError("");
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setFormData(prev => ({
              ...prev,
              location: "Location detected (Address fetch failed)"
            }));
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
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden selection:bg-brand-primary selection:text-brand-secondary">
       {/* Background Elements */}
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary/20">
        <motion.div 
            className="h-full bg-brand-primary shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-2xl w-full z-10">
        <div className="flex justify-between items-center mb-16 px-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight text-neutral-900 uppercase leading-none">TrustPro</span>
                    <span className="text-[8px] font-medium text-brand-primary uppercase tracking-[0.3em] mt-1">Verification</span>
                </div>
            </div>
            
            <div className="flex gap-4">
                {STEPS.map((s) => (
                    <div 
                        key={s.id}
                        className={`transition-all duration-500 rounded-lg flex items-center gap-2 px-3 py-1.5 ${
                            step === s.id 
                            ? "bg-brand-secondary text-brand-primary shadow-lg" 
                            : step > s.id 
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-neutral-100 text-neutral-400"
                        }`}
                    >
                        <s.icon className="w-4 h-4" />
                        <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:block`}>
                            {s.title}
                        </span>
                        {step > s.id && <CheckCircle2 className="w-3 h-3 ml-1" />}
                    </div>
                ))}
            </div>
        </div>

        <motion.div 
            layout
            className="bg-white rounded-[3rem] shadow-2xl border border-brand-border p-10 lg:p-16 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-brand-primary rounded-full" />
                  <h1 className="text-5xl font-bold tracking-tighter text-neutral-900 uppercase">Identity</h1>
                  <p className="text-brand-muted font-medium text-lg leading-relaxed">Let's start by confirming your professional identity on the network.</p>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1">Full Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <User className="w-6 h-6 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full bg-brand-surface border border-brand-border rounded-2xl py-6 pl-16 pr-6 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 shadow-inner"
                            placeholder="e.g. Rahul Sharma"
                        />
                    </div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-brand-primary rounded-full" />
                  <h1 className="text-5xl font-bold tracking-tighter text-neutral-900 uppercase">Expertise</h1>
                  <p className="text-brand-muted font-medium text-lg leading-relaxed">Highlight your core skills and market value.</p>
                </div>
                <div className="space-y-8 text-left">
                  <div className="space-y-4">
                    <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1 block">Verify Your Skills</label>
                    <div className="flex flex-wrap gap-3">
                        {SKILL_OPTIONS.map(skill => (
                        <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all uppercase tracking-widest ${
                            formData.skills.includes(skill)
                                ? "bg-brand-secondary text-brand-primary shadow-xl border-brand-secondary"
                                : "bg-brand-surface text-brand-muted border border-brand-border hover:border-brand-primary"
                            }`}
                        >
                            {skill}
                        </button>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-2">
                        <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1">Experience (Years)</label>
                        <input 
                            type="number" 
                            value={formData.experienceYears}
                            onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                            className="w-full bg-brand-surface border border-brand-border rounded-2xl py-6 px-6 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all shadow-inner"
                            placeholder="Years"
                            min="0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1 text-left block">Expected Hourly Rate (₹)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-brand-muted/30 font-bold">₹</div>
                            <input 
                                type="number" 
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                                className="w-full bg-brand-surface border border-brand-border rounded-2xl py-6 pl-12 pr-6 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all shadow-inner"
                                placeholder="Rate"
                                min="1"
                            />
                        </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1 block">Professional Tier</label>
                    <select 
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                      className="w-full bg-brand-surface border border-brand-border rounded-2xl py-6 px-6 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="L1">Level 1 - Foundational</option>
                      <option value="L2">Level 2 - Professional</option>
                      <option value="L3">Level 3 - Expert</option>
                      <option value="L4">Level 4 - Master / Specialist</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-brand-primary rounded-full" />
                  <h1 className="text-5xl font-bold tracking-tighter text-neutral-900 uppercase">Narrative</h1>
                  <p className="text-brand-muted font-medium text-lg leading-relaxed">Briefly describe your professional background and work ethics.</p>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1 block">Professional Summary</label>
                    <textarea 
                        rows={6}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-brand-surface border border-brand-border rounded-[2rem] p-8 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 shadow-inner resize-none text-lg"
                        placeholder="Describe your expertise and what makes you a trusted professional..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <div className="w-16 h-1 bg-brand-primary rounded-full" />
                  <h1 className="text-5xl font-bold tracking-tighter text-neutral-900 uppercase">Base</h1>
                  <p className="text-brand-muted font-medium text-lg leading-relaxed">Where should we look for opportunities near you?</p>
                </div>
                <div className="space-y-6">
                  <button 
                    onClick={detectLocation}
                    className="w-full bg-brand-secondary text-brand-primary font-bold py-6 rounded-2xl flex items-center justify-center gap-4 border border-brand-secondary shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    <Navigation className="w-6 h-6" /> Sync Live Location
                  </button>
                  <div className="flex items-center gap-6">
                    <div className="h-px bg-brand-border flex-1" />
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.3em]">Manual Entry</span>
                    <div className="h-px bg-brand-border flex-1" />
                  </div>
                  <div className="space-y-2 relative group">
                     <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <MapPin className="w-6 h-6 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                     </div>
                    <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-brand-surface border border-brand-border rounded-2xl py-6 pl-16 pr-6 text-brand-secondary font-semibold focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 shadow-inner"
                        placeholder="Search your city or area..."
                    />
                  </div>
                  {locationError && (
                     <div className="p-3 bg-brand-accent/5 border border-brand-accent/10 rounded-xl text-brand-accent text-xs font-bold uppercase tracking-wider text-center">
                        {locationError}
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-12">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="flex-1 bg-neutral-100 text-neutral-500 font-bold py-6 rounded-3xl flex items-center justify-center gap-3 hover:bg-neutral-200 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
            )}
            
            <button 
              onClick={step < 4 ? nextStep : handleSubmit}
              disabled={isSubmitting}
              className={`flex-[2] bg-brand-secondary text-brand-primary font-bold py-6 rounded-3xl flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98] transition-all uppercase tracking-widest text-lg ${
                isSubmitting ? "opacity-70 grayscale" : "hover:bg-neutral-800"
              }`}
            >
              {isSubmitting ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                step < 4 ? (
                    <>Next Step <ChevronRight className="w-6 h-6" /></>
                ) : (
                    <>Complete Integration <CheckCircle2 className="w-6 h-6" /></>
                )
              )}
            </button>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center gap-3">
             <div className="flex items-center gap-2 text-brand-muted font-bold text-[10px] uppercase tracking-[0.2em] bg-white border border-brand-border px-4 py-2 rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Professional Grade Encryption Active
            </div>
            <p className="text-brand-muted/40 font-medium text-[9px] uppercase tracking-[0.1em]">© 2026 TrustHire Enterprise • Professional Network Integration</p>
        </div>
      </div>
    </div>
  );
}
