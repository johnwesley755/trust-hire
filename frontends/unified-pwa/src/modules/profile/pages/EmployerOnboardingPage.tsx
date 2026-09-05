import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { motion, AnimatePresence } from 'framer-motion';
import { LocationPicker } from "../../jobs/components/LocationPicker";

const INDUSTRY_OPTIONS = [
  { id: 'CONSTRUCTION', label: 'Construction', icon: 'construction' },
  { id: 'MAINTENANCE', label: 'Maintenance & Repair', icon: 'handyman' },
  { id: 'LOGISTICS', label: 'Logistics & Delivery', icon: 'local_shipping' },
  { id: 'COOKING_CHEF', label: 'Cooking / Chef', icon: 'restaurant' },
  { id: 'HOSPITALITY', label: 'Hospitality & Hotel', icon: 'hotel' },
  { id: 'DOMESTIC_HELP', label: 'Domestic Help', icon: 'cleaning_services' },
  { id: 'RETAIL', label: 'Retail & Shop', icon: 'shopping_cart' },
  { id: 'SECURITY', label: 'Security Services', icon: 'security' },
  { id: 'AGRICULTURE', label: 'Agriculture', icon: 'agriculture' },
  { id: 'MANUFACTURING', label: 'Manufacturing', icon: 'precision_manufacturing' },
  { id: 'GARMENT', label: 'Tailoring / Garment', icon: 'apparel' },
  { id: 'BEAUTY', label: 'Salon & Beauty', icon: 'content_cut' },
  { id: 'HEALTHCARE', label: 'Healthcare', icon: 'medical_services' }
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
          businessTier: "VERIFIED",
          is_verified: true,
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

  const progress = (step / 3) * 100;

  return (
    <div className="bg-[#F5F4EF] text-[#1F3F34] font-['Bricolage_Grotesque'] antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-[#FACD15] selection:text-[#002117]">
      
      {/* Top Navigation / Progress Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col bg-[#F5F4EF]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="text-xl font-black text-[#1F3F34] tracking-tight">
                TrustHire
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F3F34]/60">Step {step} of 3</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F3F34]">{Math.round(progress)}% Complete</span>
                </div>
                <button className="material-symbols-outlined text-[#1F3F34] p-2 hover:bg-[#FACD15]/10 rounded-full transition-colors">
                    help_outline
                </button>
            </div>
        </div>
        <div className="w-full h-1.5 bg-[#E9E8E3]">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-[#FACD15] rounded-r-full shadow-[0_0_10px_rgba(250,205,21,0.5)]"
            />
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row pt-20 min-h-screen">
        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-80px)]"
                >
                    {/* Left Section: Form */}
                    <section className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                        <div className="max-w-md w-full">
                            <div className="mb-10">
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                                    Welcome to TrustHire.
                                </h1>
                                <p className="text-lg text-[#1F3F34]/70 leading-relaxed font-medium">
                                    Let's start by getting to know your business. This helps us tailor the hiring experience for your specific needs.
                                </p>
                            </div>

                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                <div className="group">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#1F3F34] mb-3">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-[#E9E8E3] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#FACD15] text-[#1F3F34] font-medium transition-all placeholder:text-[#1F3F34]/30" 
                                            placeholder="e.g., Reliance Logistics" 
                                            type="text"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                            required
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#1F3F34]/20">
                                            domain
                                        </span>
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1F3F34]">
                                            Website
                                        </label>
                                        <span className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-tighter">Optional</span>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-[#E9E8E3] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#FACD15] text-[#1F3F34] font-medium transition-all placeholder:text-[#1F3F34]/30" 
                                            placeholder="https://company.com" 
                                            type="url"
                                            value={formData.companyWebsite}
                                            onChange={(e) => setFormData({...formData, companyWebsite: e.target.value})}
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#1F3F34]/20">
                                            language
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        disabled={!formData.companyName}
                                        className="w-full bg-[#FACD15] text-[#002117] py-5 rounded-[12px] font-extrabold uppercase tracking-widest shadow-[0_4px_0_0_#C39F00] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                                    >
                                        NEXT STEP
                                        <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                                            arrow_forward
                                        </span>
                                    </button>
                                </div>
                            </form>
                            <p className="mt-8 text-center text-sm text-[#1F3F34]/40 font-medium">
                                By continuing, you agree to our Terms of Service.
                            </p>
                        </div>
                    </section>

                    {/* Right Section: Visual */}
                    <section className="hidden lg:flex lg:w-1/2 relative bg-[#EFEEE9] items-center justify-center p-12 overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FACD15]/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#FACD15]/5 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10 w-full max-w-lg">
                            <div className="relative w-full aspect-square bg-white rounded-[48px] p-6 shadow-2xl shadow-[#1F3F34]/5">
                                <div className="w-full h-full blob-mask overflow-hidden bg-[#FACD15]/20">
                                    <img 
                                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
                                        alt="Professional Indian employer" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMwrbXOaZ1sZJoc_-LAlahXR8jSZWgKJ8KasA2UIEfC4-6P7dBB-jNhQLyyl4BE1Uh6pdaX0bljB4szmLiKigt_RsTxbQQNHzTo8dKTg5MVzUZetvx_jgBJ7tiBKGXdhVSO_u0Mlj5bGCqwMRY3jI0RKCBhn_kItjpK-tO1C_bMKJNon68JR7RgYSZTnN20by-IAWm4sxkH2-0Dq1BwQZJqnzgvHda7G6CQnXxz8BDm49LLgDc016PbHAG-l-2KufTQ1vK1SLxSA0" 
                                    />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#FACD15] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#002117] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-[#1F3F34]/40 leading-none mb-1">Status</p>
                                        <p className="text-xs font-bold text-[#1F3F34] leading-none">Verified Employer</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-12 -left-8 bg-white p-5 rounded-[24px] shadow-xl max-w-[200px]">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span key={i} className="material-symbols-outlined text-[#FACD15] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold leading-tight">"Finding trust-worthy talent has never been simpler."</p>
                                </div>
                            </div>
                            <div className="mt-12 text-center lg:text-left px-4">
                                <p className="text-[#1F3F34] font-extrabold text-2xl leading-tight font-['Bricolage_Grotesque']">
                                    Powering over 50,000+ logistics companies across Bharat.
                                </p>
                            </div>
                        </div>
                    </section>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto pt-12 pb-12 px-6 lg:px-12 gap-12"
                >
                    <section className="flex-1 space-y-10 order-2 lg:order-1">
                        <header>
                            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#1F3F34]">
                                Define your <span className="relative">workforce<span className="absolute bottom-1 left-0 w-full h-3 bg-[#FACD15]/30 -z-10"></span></span> niche.
                            </h1>
                            <p className="mt-4 text-lg text-[#1F3F34]/70 leading-relaxed max-w-lg font-medium">
                                Select the industry sector you operate in and tell us about your company's mission. This helps us match you with specialized talent.
                            </p>
                        </header>

                        <div className="space-y-4">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#1F3F34]/50">Select Industry Sector</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {INDUSTRY_OPTIONS.map(opt => (
                                    <button 
                                        key={opt.id}
                                        onClick={() => setFormData({...formData, industry: opt.id})}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all group shadow-sm active:scale-95 ${
                                            formData.industry === opt.id 
                                            ? 'bg-[#FACD15] text-[#002117] border-[#FACD15] scale-105 shadow-lg' 
                                            : 'bg-white border-transparent hover:border-[#FACD15]'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined ${formData.industry === opt.id ? '' : 'text-[#FACD15] group-hover:scale-110'} transition-transform`}
                                              style={{ fontVariationSettings: formData.industry === opt.id ? "'FILL' 1" : "'FILL' 0" }}>
                                            {opt.icon}
                                        </span>
                                        <span className="text-sm font-bold">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-[#1F3F34]/50">Company Bio</label>
                                <span className={`text-[10px] font-medium ${formData.profileBio.length < 100 ? 'text-red-400' : 'text-[#1F3F34]/40'}`}>
                                    {formData.profileBio.length} / 500 (Min 100)
                                </span>
                            </div>
                            <div className="relative group">
                                <textarea 
                                    className="w-full bg-[#E9E8E3] border-none rounded-2xl p-6 text-[#1F3F34] placeholder:text-[#1F3F34]/30 focus:ring-2 focus:ring-[#FACD15] transition-all resize-none font-medium h-40" 
                                    placeholder="Share your story, values, and why people love working with you..."
                                    value={formData.profileBio}
                                    onChange={(e) => setFormData({...formData, profileBio: e.target.value.slice(0, 500)})}
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex items-center gap-6 font-['Bricolage_Grotesque']">
                            <button 
                                onClick={nextStep}
                                disabled={!formData.industry || formData.profileBio.length < 100}
                                className="group relative flex-1 lg:flex-none lg:min-w-[240px] bg-[#FACD15] text-[#002117] font-extrabold text-sm py-5 px-8 rounded-[12px] shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-inner transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                            >
                                Next Step
                                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button 
                                onClick={nextStep}
                                className="text-[#1F3F34]/40 hover:text-[#1F3F34] font-bold text-[11px] uppercase tracking-widest transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    </section>

                    <section className="flex-1 lg:flex relative min-h-[400px] lg:min-h-0 order-1 lg:order-2 flex items-center justify-center">
                        <div className="absolute inset-0 overflow-hidden -z-10">
                            <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-[#FACD15]/20 rounded-full blur-[80px]"></div>
                            <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] bg-[#456559]/10 rounded-full blur-[60px]"></div>
                        </div>
                        <div className="relative w-full max-w-md aspect-square lg:aspect-[4/5] xl:aspect-square">
                            <div className="w-full h-full bg-[#E9E8E3] overflow-hidden organic-blob shadow-2xl">
                                <img 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Oj7x_jSw7m127nPvwKZkhxSuiQh1b79s7ME-jQi93dzK-b4hNxlPTkA8Q0-TLvSh5AfLzsJ0ptYj7HEhHSvxaJQBpIka8UON3qIt1Q5guk3AQmPAiX1RAgyu9okS0M4_I-3ynWMtSikR3uaVUCl3bBJuBTxqT1DTalGe7D5aZHxT74i1KDCrWOmvNkXtPzmCzkkTiwf3_okH8J3SFw4ewd__p1ioN9HSmw5fxsi7TuH4yfFwRzLrl_7Dx7p_TtbdwWlYOcWu9tA" 
                                    alt="Industrial sector" 
                                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                                />
                            </div>
                            {/* Floating Cards OUTSIDE overflow-hidden container */}
                            <div className="absolute bottom-16 right-0 lg:translate-x-1/4 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] border-l-4 border-[#FACD15]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-[#FACD15] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    <span className="text-[10px] font-bold text-[#1F3F34] uppercase tracking-wider">Trusted Hire</span>
                                </div>
                                <p className="text-xs text-[#1F3F34]/70 italic leading-relaxed font-medium">"Helping us find 50+ specialized welders in less than 48 hours."</p>
                            </div>
                            <div className="absolute top-12 -left-8 bg-[#1F3F34] text-[#FACD15] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FACD15]/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-black tracking-tight">85% Match</span>
                                    <span className="text-[8px] uppercase font-bold text-[#FACD15]/60">Optimization</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex-grow flex flex-col lg:flex-row min-h-[calc(100vh-80px)]"
                >
                    <section className="flex-1 px-8 lg:px-20 py-12 flex flex-col justify-center max-w-3xl">
                        <div className="space-y-2 mb-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1F3F34] leading-[1.1]">Where are you located?</h1>
                            <p className="text-lg text-[#1F3F34]/70 max-w-md font-medium">Setting your base helps us connect you with local opportunities and verified talent in your neighborhood.</p>
                        </div>
                        <div className="space-y-8 font-['Bricolage_Grotesque']">
                            <button 
                                onClick={detectLocation}
                                className="w-full group relative flex items-center justify-between p-6 bg-white rounded-xl shadow-[0_20px_40px_-10px_rgba(31,63,52,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(31,63,52,0.1)] transition-all duration-300 border border-transparent hover:border-[#FACD15]/30 active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-[#FACD15] rounded-full flex items-center justify-center text-[#002117] shadow-md">
                                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-xl font-bold text-[#1F3F34]">Use Current Location</span>
                                        <span className="block text-sm text-[#1F3F34]/60 font-medium">Fastest way to get started</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-[#1F3F34]/30 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="flex-grow h-px bg-[#1F3F34]/10"></div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1F3F34]/40">Or Enter Manually</span>
                                <div className="flex-grow h-px bg-[#1F3F34]/10"></div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold uppercase tracking-widest text-[#1F3F34] ml-1">Business Address</label>
                                <div className="relative">
                                    <textarea 
                                        className="w-full bg-[#E9E8E3] border-none rounded-xl p-5 text-[#1F3F34] focus:ring-2 focus:ring-[#FACD15] transition-all placeholder:text-[#1F3F34]/30 font-medium h-32" 
                                        placeholder="Street, Building name, Area, City..."
                                        value={formData.businessAddress}
                                        onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                                    />
                                    <div className="absolute right-4 bottom-4">
                                        <span className="material-symbols-outlined text-[#1F3F34]/20">business</span>
                                    </div>
                                </div>
                                {locationError && <p className="text-red-500 text-xs font-bold px-1">{locationError}</p>}
                            </div>
                        </div>
                        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 font-['Bricolage_Grotesque']">
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.businessAddress}
                                className="w-full sm:w-auto px-10 py-5 bg-[#FACD15] text-[#002117] font-black text-sm uppercase tracking-wider rounded-[12px] shadow-[0_4px_0_0_#C39F00] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                            >
                                {isSubmitting ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                                    <>
                                        COMPLETE SETUP
                                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={prevStep}
                                className="text-[#1F3F34]/60 font-bold text-xs uppercase tracking-widest hover:text-[#1F3F34] transition-colors"
                            >
                                Back to previous
                            </button>
                        </div>
                    </section>

                    <section className="flex-1 relative hidden lg:flex items-center justify-center bg-[#EFEEE9] overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACD15]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FACD15]/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-12 space-y-8">
                            <div className="blob-mask w-full max-w-xl aspect-square bg-[#E9E8E3] relative overflow-hidden shadow-2xl z-0 ring-4 ring-white/50">
                                <LocationPicker 
                                    onLocationSelect={(lat, lon, addr, city) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            latitude: lat,
                                            longitude: lon,
                                            businessAddress: addr,
                                            city: city
                                        }));
                                    }}
                                    initialPos={formData.latitude && formData.longitude ? { lat: formData.latitude, lon: formData.longitude } : undefined}
                                />
                            </div>

                            {/* Floating Map Card */}
                            <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/50 min-w-[320px] z-30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-12 h-12 bg-[#1F3F34] rounded-xl flex items-center justify-center text-[#FACD15]">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1F3F34] text-sm leading-tight">Interactive Mapping</p>
                                    <p className="text-xs text-[#1F3F34]/60 font-medium italic">Click the map to precisely pin your base</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Mobile-only Progress Sticky Footer (Steps 2 and 3) */}
      {step > 1 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#E9E8E3] p-4 z-50">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <div className="w-full h-1.5 bg-[#E9E8E3] rounded-full overflow-hidden">
                        <div className="bg-[#FACD15] h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-[#1F3F34] uppercase tracking-widest">{Math.round(progress)}% Complete</span>
            </div>
        </div>
      )}

      {/* Font & Styles Integration */}
      <style>{`
        .blob-mask {
            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C86.9,14.6,81.2,29.2,73.4,42.5C65.6,55.8,55.7,67.7,43.3,73.8C30.9,80,16,80.3,1.4,77.9C-13.2,75.5,-26.4,70.3,-38.4,63.8C50.4,57.2,-61.2,49.2,-68.8,38C-76.4,26.8,-80.8,12.4,-81,-1.9C-81.2,-16.3,-77.2,-30.5,-69.3,-41.8C-61.4,-53.1,-49.7,-61.5,-37.4,-69.8C-25.1,-78.2,-12.6,-86.4,1.4,-88.9C15.4,-91.3,30.7,-83.5,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
            -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C86.9,14.6,81.2,29.2,73.4,42.5C65.6,55.8,55.7,67.7,43.3,73.8C30.9,80,16,80.3,1.4,77.9C-13.2,75.5,-26.4,70.3,-38.4,63.8C50.4,57.2,-61.2,49.2,-68.8,38C-76.4,26.8,-80.8,12.4,-81,-1.9C-81.2,-16.3,-77.2,-30.5,-69.3,-41.8C-61.4,-53.1,-49.7,-61.5,-37.4,-69.8C-25.1,-78.2,-12.6,-86.4,1.4,-88.9C15.4,-91.3,30.7,-83.5,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-position: center;
            -webkit-mask-position: center;
        }
        .organic-blob {
            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.4,90.1,-17.7,89.2,-2.1C88.3,13.5,83.8,29,75.2,42.5C66.6,56,53.8,67.5,39.4,75.1C25,82.7,8.9,86.4,-6.4,85.1C-21.7,83.7,-36.2,77.2,-48.8,68.4C-61.4,59.6,-72,48.5,-79.1,35.5C-86.2,22.5,-89.7,7.7,-88.4,-6.8C-87.1,-21.3,-81,-35.4,-71.5,-46.9C-62,-58.4,-49.1,-67.3,-35.7,-74.8C-22.3,-82.3,-8.4,-88.4,5.4,-89.1C19.2,-89.8,30.6,-83.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
            -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.4,90.1,-17.7,89.2,-2.1C88.3,13.5,83.8,29,75.2,42.5C66.6,56,53.8,67.5,39.4,75.1C25,82.7,8.9,86.4,-6.4,85.1C-21.7,83.7,-36.2,77.2,-48.8,68.4C-61.4,59.6,-72,48.5,-79.1,35.5C-86.2,22.5,-89.7,7.7,-88.4,-6.8C-87.1,-21.3,-81,-35.4,-71.5,-46.9C-62,-58.4,-49.1,-67.3,-35.7,-74.8C-22.3,-82.3,-8.4,-88.4,5.4,-89.1C19.2,-89.8,30.6,-83.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
            mask-size: contain;
            -webkit-mask-size: contain;
            mask-repeat: no-repeat;
            -webkit-mask-repeat: no-repeat;
            mask-position: center;
            -webkit-mask-position: center;
        }
      `}</style>
    </div>
  );
}
