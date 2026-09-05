import { motion } from "framer-motion";
import { AdvancedFileUpload } from "../../components/AdvancedFileUpload";

interface OnboardingData {
  fullName: string;
  bio: string;
  skills: string[];
  experienceYears: string;
  hourlyRate: string;
  level: string;
  location: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  profile_image_url: string;
}

interface IdentityStepProps {
  formData: OnboardingData;
  setFormData: (data: OnboardingData | ((prev: OnboardingData) => OnboardingData)) => void;
  onNext: () => void;
}

export default function IdentityStep({ formData, setFormData, onNext }: IdentityStepProps) {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full flex flex-col items-center justify-center relative"
    >

        <div className="max-w-xl w-full">
            {/* Identity Card */}
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] relative overflow-hidden text-left">
                {/* Editorial Profile Blob (Decorative) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EFEEE9] organic-blob -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                    <div className="mb-10">
                        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-[#1F3F34] tracking-tight mb-4">Identity</h1>
                        <p className="text-lg text-[#1F3F34]/70 leading-relaxed">Confirm your professional presence on the global grid.</p>
                    </div>

                    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
                        {/* Profile Image Section */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#e9e8e3] ring-2 ring-[#FACD15] ring-offset-4">
                                    {formData.profile_image_url ? (
                                        <img alt="Profile" className="w-full h-full object-cover" src={formData.profile_image_url} />
                                    ) : (
                                        <div className="w-full h-full bg-[#f2f1ec] flex items-center justify-center text-[#1F3F34]/20">
                                            <span className="material-symbols-outlined text-4xl">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0">
                                    <AdvancedFileUpload 
                                        onUploadSuccess={(urls) => setFormData({...formData, profile_image_url: urls[0]})}
                                        initialUrls={formData.profile_image_url ? [formData.profile_image_url] : []}
                                        trigger={(open) => (
                                            <button 
                                                onClick={open}
                                                className="bg-[#FACD15] text-[#002117] p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform" 
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-sm font-bold">edit</span>
                                            </button>
                                        )}
                                    />
                                </div>
                            </div>
                            <div>
                                <span className="block font-headline font-bold text-[#1F3F34]">Profile Image</span>
                                <span className="text-xs text-[#1F3F34]/50 uppercase tracking-widest">Protocol Required</span>
                            </div>
                        </div>

                        {/* Form Field */}
                        <div className="space-y-2 text-left">
                            <label className="font-headline font-bold text-xs uppercase tracking-widest text-[#1F3F34]" htmlFor="fullname">Full Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1F3F34]/40">person</span>
                                <input 
                                    className="w-full pl-12 pr-4 py-4 bg-[#e9e8e3] border-none rounded-[1rem] focus:ring-2 focus:ring-[#FACD15] text-[#1F3F34] placeholder:text-[#1F3F34]/30 transition-all font-body outline-none" 
                                    id="fullname" 
                                    placeholder="E.g. Arjun Vardhan" 
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="pt-4">
                            <button 
                                className="w-full bg-[#FACD15] text-[#002117] font-headline font-extrabold py-4 px-8 rounded-[1rem] uppercase tracking-wider flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] disabled:opacity-50" 
                                type="submit"
                                disabled={!formData.fullName}
                            >
                                Next Protocol
                                <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Contextual Footnote */}
            <p className="text-center mt-8 text-xs text-[#1F3F34]/40 font-bold uppercase tracking-[0.2em]">Step 01 / 04 • Basic Protocol Verification</p>
        </div>

    </motion.div>
  );
}
