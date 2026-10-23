import { Link } from "react-router-dom";
import { useState } from "react";
import { miscService } from "../../../services/misc.service";
import { earlyAccessSchema } from '../../../validations/zodSchema';

export function EmployerHero() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

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
    <section className="relative min-h-[80vh] flex items-center pt-32 pb-16 overflow-hidden bg-[#F8FAFC]">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FACD15]/20 organic-blob blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-emerald-900/10 organic-blob-alt blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1931]/5 text-[#0A1931] text-xs font-bold uppercase tracking-wider mb-6 border border-[#0A1931]/10">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            For Employers & Contractors
          </div>
          <h1 className="text-5xl md:text-[68px] font-extrabold leading-[0.95] text-[#0A1931] text-heavy mb-6">
            Hire Verified Workers. <br/>
            <span className="relative inline-block">
              Zero Risk.
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FACD15] -z-10 opacity-70"></span>
            </span>
          </h1>
          <p className="text-xl text-[#0A1931]/80 leading-snug mb-8 max-w-lg font-medium">
            Be among the first employers to hire verified blue-collar talent. Secure your spot on India's most trusted hiring network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mb-8">
            <Link
              to="/sign-up?role=EMPLOYER"
              className="bg-[#FACD15] text-[#0A1931] px-8 py-4 rounded-xl font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_0_0_#C39F00] hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
            >
              <span className="material-symbols-outlined text-xl">work</span>
              Post a Job Now
            </Link>
            <Link
              to="/find-workers"
              className="bg-white border-2 border-[#0A1931]/10 text-[#0A1931] px-8 py-4 rounded-xl font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#FAF9F4] transition-all"
            >
              <span className="material-symbols-outlined text-xl">person_search</span>
              Find Workers
            </Link>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-800 px-6 py-4 rounded-xl flex items-center gap-3 max-w-lg">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <p className="font-bold text-sm">You're on the list! Check your email for confirmation.</p>
            </div>
          ) : (
            <div className="max-w-lg">
              <p className="text-[10px] font-bold text-[#0A1931]/50 mb-3 uppercase tracking-widest">Fields marked with <span className="text-red-500">*</span> are mandatory</p>
              <form onSubmit={handleWaitlistSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your work email *" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-5 py-3.5 rounded-xl border border-[#0A1931]/20 focus:outline-none focus:ring-2 focus:ring-[#FACD15] bg-white/90 text-sm"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#0A1931] text-white px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#2e5749] transition-all disabled:opacity-70 whitespace-nowrap"
                >
                  {isLoading ? 'Sending...' : 'Request Access'}
                </button>
              </form>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <p className="mt-6 text-sm font-bold text-[#0A1931]/60 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
            Profile authentication & skill verification for every candidate
          </p>
        </div>

        <div className="relative">
          <div className="w-full aspect-square bg-[#FACD15]/15 rounded-[3rem] absolute -top-4 -right-4 -z-20 scale-105"></div>
          <div className="w-full aspect-square overflow-hidden rounded-[3rem] shadow-2xl relative border-4 border-white bg-white">
            <img 
              alt="Professional Indian chef smiling in a kitchen" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" 
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-4 -left-4 bg-white p-5 rounded-2xl shadow-xl border-l-4 border-[#FACD15] max-w-[240px]">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-[#0A1931] text-[#FACD15] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Top 1% Talent</span>
            </div>
            <h3 className="font-bold text-[#0A1931]">Verified Workforce</h3>
            <p className="text-[12px] text-[#0A1931]/60 font-medium">Ready to deploy within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
