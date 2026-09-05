import { Link } from "react-router-dom";
import { useState } from "react";
import { miscService } from "../../../services/misc.service";
import { earlyAccessSchema } from '../../../validations/zodSchema';

export function WorkerHero() {
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
      await miscService.requestEarlyAccess({ email, source: 'worker' });
      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center min-h-[800px]">
      {/* Extra Hero Blobs for Visual Interest */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#FACD15]/10 blob-1 -z-10 blur-2xl"></div>
      <div className="absolute top-10 right-1/4 w-40 h-40 bg-[#456559]/20 blob-4 -z-10 opacity-60"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#456559]/10 blob-3 -z-10 blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F3F34]/5 text-[#1F3F34] text-xs font-black uppercase tracking-wider mb-6 border border-[#1F3F34]/10">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          For Blue-Collar Professionals
        </div>

        <h1 className="text-[48px] md:text-[68px] font-extrabold text-[#1F3F34] leading-[1.05] tracking-tight font-headline">
          Your Skills Deserve <br/>
          <span className="relative inline-block text-[#1F3F34]">
            Better Pay.
            <span className="absolute -bottom-2 left-0 w-full h-4 bg-[#FACD15] -z-10 rounded-full opacity-80"></span>
          </span>
          <br/>We Make That Happen.
        </h1>
        
        <p className="mt-6 text-xl md:text-2xl text-[#1F3F34]/80 max-w-xl leading-relaxed font-medium">
          Connect with verified employers who value your work. Get insurance, on-time weekly pay, and a clear path to grow your earnings.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg">
          <Link
            to="/sign-up?role=WORKER"
            className="bg-[#FACD15] text-[#1F3F34] px-8 py-4 rounded-xl font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_4px_0_0_#C39F00] hover:translate-y-[-2px] active:translate-y-[2px] transition-all"
          >
            <span className="material-symbols-outlined text-xl">badge</span>
            Join as Worker
          </Link>
          <Link
            to="/search"
            className="bg-white border-2 border-[#1F3F34]/10 text-[#1F3F34] px-8 py-4 rounded-xl font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F5F4EF] transition-all"
          >
            <span className="material-symbols-outlined text-xl">search</span>
            Browse Jobs
          </Link>
        </div>

        {/* Waitlist Form */}
        <div className="mt-10 pt-8 border-t border-[#1F3F34]/10 max-w-lg">
          <p className="text-[10px] font-bold text-[#1F3F34]/60 uppercase tracking-widest mb-3">Or get early job alerts via email</p>
          {isSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-800 px-6 py-4 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <p className="font-bold text-sm">You're on the priority notification list!</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter email for alerts" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 rounded-xl border border-[#1F3F34]/20 focus:outline-none focus:ring-2 focus:ring-[#FACD15] bg-white/90 text-sm"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#1F3F34] text-white px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#2e5749] transition-all disabled:opacity-70 whitespace-nowrap"
              >
                {isLoading ? 'Sending...' : 'Get Alerts'}
              </button>
            </form>
          )}
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex -space-x-2">
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" alt="Worker 1" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"/>
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" alt="Worker 2" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"/>
            <img className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" alt="Worker 3" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop"/>
          </div>
          <span className="text-xs font-bold text-[#1F3F34]/70">Join 12,000+ verified professionals in India</span>
        </div>
      </div>

      <div className="relative">
        <div className="relative w-full aspect-square max-w-lg mx-auto">
          <div className="absolute inset-0 bg-[#FACD15]/15 rounded-[3rem] -rotate-3 transform shadow-2xl"></div>
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-white h-full">
            <img 
              alt="Confident Indian professional worker" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop"
            />
          </div>
          
          {/* Floating Card 1: Salary boost */}
          <div className="absolute -top-4 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-[#1F3F34]/5 animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined font-bold text-2xl">trending_up</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#1F3F34]/60 uppercase tracking-wider">Average Monthly Pay</p>
              <p className="text-xl font-black text-[#1F3F34]">₹24,000+</p>
            </div>
          </div>

          {/* Floating Card 2: Skill accreditation */}
          <div className="absolute -bottom-4 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-[#1F3F34]/5 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
            <div className="w-12 h-12 rounded-xl bg-[#FACD15]/20 flex items-center justify-center text-[#1F3F34]">
              <span className="material-symbols-outlined font-bold text-2xl text-[#1F3F34]">verified</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#1F3F34]/60 uppercase tracking-wider">Accredited Skill Badge</p>
              <p className="text-xl font-black text-[#1F3F34]">Level 3 Master</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
