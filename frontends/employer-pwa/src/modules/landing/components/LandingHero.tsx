import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { miscService } from "../../../services/misc.service";
import { earlyAccessSchema } from '../../../validations/zodSchema';
import { useLanguage } from "../../../providers/LanguageContext";

export function LandingHero() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const { translations, translate } = useLanguage();

  const originalTexts = {
    heading: "Hire Verified Workers. Zero Risk.",
    subheading: "Be among the first employers to hire verified blue-collar talent. Secure your spot on India's most trusted hiring network."
  };

  useEffect(() => {
    const handleTrigger = () => {
      translate(originalTexts);
    };
    window.addEventListener('trigger-translation', handleTrigger);
    return () => window.removeEventListener('trigger-translation', handleTrigger);
  }, [translate]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = earlyAccessSchema.safeParse({ email });
    if (!validationResult.success) {
        setError(validationResult.error.issues[0].message);
        return;
    }

    setIsLoading(true);
    setError('');
    try {
      await miscService.requestEarlyAccess({ email, source: 'employer' });
      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center pt-[72px] pb-8 overflow-x-hidden bg-brand-beige">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-brand-amber/20 organic-blob blur-3xl opacity-50 -z-10"></div>
      <div className="absolute top-1/2 -right-24 md:-right-48 w-80 h-80 md:w-[500px] md:h-[500px] bg-emerald-900/10 organic-blob-alt blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-12 grid md:grid-cols-2 gap-8 items-center relative">
        <div className="z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/5 text-brand-forest text-[10px] md:text-xs font-bold uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Early Access Now Open
            </div>
          </div>

          <h1 className="text-4xl md:text-[68px] font-extrabold leading-[1.1] text-brand-forest text-heavy mb-6">
            {translations.heading || originalTexts.heading}
          </h1>
          <p className="text-lg md:text-xl text-brand-forest/80 leading-snug mb-8 max-w-lg">
            {translations.subheading || originalTexts.subheading}
          </p>
          {isSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <p className="font-medium">You're on the list! Check your email for confirmation.</p>
            </div>
          ) : (
            <div className="max-w-lg">
              <p className="text-[10px] font-bold text-brand-forest/50 mb-3 uppercase tracking-widest">Fields marked with <span className="text-red-500">*</span> are mandatory</p>
              <form onSubmit={handleWaitlistSubmit} noValidate className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    placeholder="Enter your work email *" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-xl border border-brand-forest/20 focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-primary px-8 py-4 uppercase text-lg shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] hover:translate-y-[-2px] flex items-center justify-center whitespace-nowrap disabled:opacity-70"
                >
                  {isLoading ? <span className="material-symbols-outlined animate-spin">autorenew</span> : 'Request Access'}
                </button>
              </form>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="mt-6 text-sm font-bold text-brand-forest/50 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Aadhaar-linked verification for every profile
          </p>
        </div>

        <div className="relative">
          <div className="organic-blob w-full aspect-square bg-brand-amber/10 absolute -top-4 -right-4 -z-20 scale-105"></div>
          <div className="organic-blob w-full aspect-square overflow-hidden shadow-2xl relative">
            <img 
              alt="Professional Indian chef smiling in a kitchen" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCldjp9y2iCXzw_TYlraY2g4bgvYnLsdXCK4uUj52MODFpJXwuAoEAJUs2GPtD1s2d8lK67_7UHuTHJBg8_H8Ub1p2zW_hMcVHN0oOSiT-9XHZzZvyCx5seHxxo1px1mBmpmC0RNtcgWsKwhH4uo-qTRoPNFWfdfIGKGPhbSpOC8WiYsq1zInGDXDGphRTuZ70orcrHBI9YpgTIRJVfMeydtNINLuF5PZ9s0PSUIrZpHOUBi0Y2HB9vTSS_l2KgQ8zpGkLIP9keqZc" 
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-4 -left-4 bg-white p-5 rounded-2xl shadow-xl border-l-4 border-brand-amber max-w-[240px]">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-brand-forest text-brand-amber text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Top 1% Talent</span>
            </div>
            <h3 className="font-bold text-brand-forest">Verified Workforce</h3>
            <p className="text-[12px] text-brand-forest/60">Ready to start within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
