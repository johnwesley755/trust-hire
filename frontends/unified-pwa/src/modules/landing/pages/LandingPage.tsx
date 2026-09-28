import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Wallet, 
  Briefcase, 
  UserCheck, 
  Building2, 
  Clock, 
  Lock, 
  CheckCheck, 
  Navigation, 
  Star, 
  ArrowRight, 
  Menu, 
  X, 
  Wrench, 
  Timer, 
  PhoneCall, 
  HeartHandshake, 
  Zap,
  Check,
  User,
  BadgeCheck,
  Headphones,
  LayoutDashboard,
  FileCheck2,
  Bookmark
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useAuth();
  const [activeRole, setActiveRole] = useState<'hire' | 'work'>('hire');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isEmployer = user?.role === 'EMPLOYER';
  const isAdmin = user?.role === 'ADMIN';
  const isCandidate = user?.role === 'WORKER';

  const userDashboardTarget = isAdmin
    ? '/admin/dashboard'
    : isEmployer
    ? '/dashboard'
    : '/search';

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-surface font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white min-h-screen">
      {/* Persisted Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform bg-blue-50 border border-blue-100 rounded-xl p-1">
                <img src="/logo.png" alt="TrustHyre Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Trust<span className="text-[#0066FF]">Hyre</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5 uppercase">VERIFIED WORKFORCE</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <a href="#how-it-works" className="hover:text-[#0066FF] transition-colors">How It Works</a>
              <a href="#popular-jobs" className="hover:text-[#0066FF] transition-colors">Popular Jobs</a>
              <a href="#benefits" className="hover:text-[#0066FF] transition-colors">Why People Trust Us</a>
              <a href="#faq" className="hover:text-[#0066FF] transition-colors">Help & FAQ</a>
            </nav>
          </div>

          {/* Right Header Controls based on Auth State */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-2.5">
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="px-4.5 py-2.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                    <span>Admin Command Center</span>
                  </Link>
                ) : isEmployer ? (
                  <>
                    <Link
                      to="/find-workers"
                      className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors items-center gap-1.5 border border-slate-200 bg-white shadow-xs"
                    >
                      <UserCheck className="w-4 h-4 text-[#0066FF]" />
                      <span>Find Candidates</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-4.5 py-2.5 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Employer Dashboard</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/search"
                      className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors items-center gap-1.5 border border-slate-200 bg-white shadow-xs"
                    >
                      <Briefcase className="w-4 h-4 text-[#0066FF]" />
                      <span>Find Jobs</span>
                    </Link>
                    <Link
                      to="/applied-jobs"
                      className="px-4.5 py-2.5 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>My Applied Jobs</span>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/sign-in?role=worker" className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors items-center gap-1.5 border border-slate-200 bg-white shadow-xs">
                  <UserCheck className="w-4 h-4 text-[#0066FF]" />
                  <span>Candidate Login</span>
                </Link>
                <Link to="/sign-in?role=employer" className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Employer Login</span>
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-5 space-y-4 shadow-xl">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-700">
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                How It Works
              </a>
              <a 
                href="#popular-jobs" 
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Popular Jobs
              </a>
              <a 
                href="#benefits" 
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Why People Trust Us
              </a>
              <a 
                href="#faq" 
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Help & FAQ
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {isSignedIn ? (
                <Link
                  to={userDashboardTarget}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-[#0052CC] text-white text-center flex items-center justify-center gap-2 shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Dashboard' : isEmployer ? 'Employer Dashboard' : 'My Candidate Portal'}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/sign-in?role=worker"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 text-center flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-[#0066FF]" />
                    <span>Candidate Login</span>
                  </Link>
                  <Link
                    to="/sign-in?role=employer"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-[#0052CC] text-white text-center flex items-center justify-center gap-2 shadow-md"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Employer Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="space-y-24 md:space-y-32">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO - SIMPLE PROMISE FOR BOTH WORKERS & EMPLOYERS */}
        {/* ========================================================================= */}
        <section className="relative pt-8 md:pt-14 pb-12 overflow-hidden" id="hero">
          {/* Ambient background decoration */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-blue-200/50 via-sky-100/40 to-emerald-100/40 blur-3xl rounded-full -z-10 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Content: Plain English, Zero Jargon */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-bold tracking-wide uppercase shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping"></span>
                  Fast, Guaranteed & Honest
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Get Trusted Workers. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-blue-600">Find Daily Jobs.</span> <br />
                  Paid Right on Time.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 font-body max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  No middleman delays, no unfair cuts. TrustHyre connects everyday businesses with verified skilled workers, technicians, and specialists with guaranteed safe payments.
                </p>

                {/* Dual Simple Action Pill Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  {isSignedIn ? (
                    isAdmin ? (
                      <>
                        <Link to="/admin/dashboard" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2.5 group transition-all hover:scale-[1.02]">
                          <ShieldCheck className="w-5 h-5" />
                          <span>Open Admin Command</span>
                        </Link>
                        <Link to="/admin/verifications" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-base shadow-xs flex items-center justify-center gap-2.5 hover:border-[#0066FF] hover:text-[#0066FF] transition-all hover:scale-[1.02]">
                          <FileCheck2 className="w-5 h-5 text-blue-600" />
                          <span>Review Verification Queue</span>
                        </Link>
                      </>
                    ) : isEmployer ? (
                      <>
                        <Link to="/post-job" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2.5 group transition-all hover:scale-[1.02]">
                          <Briefcase className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                          <span>Post a New Job</span>
                        </Link>
                        <Link to="/find-workers" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-base shadow-xs flex items-center justify-center gap-2.5 hover:border-[#0066FF] hover:text-[#0066FF] transition-all hover:scale-[1.02]">
                          <UserCheck className="w-5 h-5 text-emerald-600" />
                          <span>Find Verified Candidates</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/search" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2.5 group transition-all hover:scale-[1.02]">
                          <Briefcase className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                          <span>Browse Available Jobs</span>
                        </Link>
                        <Link to="/applied-jobs" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-base shadow-xs flex items-center justify-center gap-2.5 hover:border-[#0066FF] hover:text-[#0066FF] transition-all hover:scale-[1.02]">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>View My Applied Jobs</span>
                        </Link>
                      </>
                    )
                  ) : (
                    <>
                      <Link to="/sign-up?role=employer" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2.5 group transition-all hover:scale-[1.02]">
                        <Briefcase className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                        <span>I Need to Hire Workers</span>
                      </Link>
                      <Link to="/sign-up?role=worker" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-base shadow-xs flex items-center justify-center gap-2.5 hover:border-[#0066FF] hover:text-[#0066FF] transition-all hover:scale-[1.02]">
                        <Wallet className="w-5 h-5 text-emerald-600" />
                        <span>I Want Daily Jobs & Work</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust proof badges in simple terms */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Government ID Checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#0066FF] shrink-0" />
                    <span>Safe Money Escrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Same-Day Direct Payout</span>
                  </div>
                </div>
              </div>

              {/* Right Content: Real Photography with Overlaid Floating Cards */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Lj0Ng7SlNWBdmMHa5JbtqPxAzSkk5KG_RFvduc7waqQtB4DN3_HEfqsTldQxZLEOkxojWUBJnoDLPK4KiLN6hrLuoYeGJb1DIOPPlYfvgLwGZYLPjtX2PY2gDaQekUhbNa1EuXYcf1sg0KoqbBPR4uegU3U_xOHPzsijIaarOvf56Lh1mGyrZsRme0ZxUwmzAgj688Ppm4OS6doU5acw0nAfjnzTODKZKt8YuZa7OeaCDHCBvQ8fEQ" alt="Real friendly blue collar workers team" className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-4 left-5 right-5 text-white flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                        <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Over 140,000+ Active Pros
                      </p>
                      <p className="text-xs text-white/80">From local neighborhood repairs to factory jobs</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-xs font-extrabold uppercase tracking-wide text-white">4.9 ★ Rated</span>
                  </div>
                </div>

                {/* Floating Interactive Card 1: Worker Payment Proof */}
                <div className="absolute -top-5 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[260px] animate-float">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Daily Job Completed</span>
                    <p className="text-sm font-extrabold text-slate-900">₹1,200 Transferred</p>
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> Direct UPI Paid
                    </p>
                  </div>
                </div>

                {/* Floating Interactive Card 2: Fast Arrival */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[240px] animate-float-delayed">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold shrink-0">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Nearby Worker Found</span>
                    <p className="text-sm font-extrabold text-slate-900">Arrives in 18 mins</p>
                    <p className="text-[11px] text-slate-500">ID & Police Check Verified</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: HOW IT WORKS - SIMPLE STEPS */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="how-it-works">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Easy 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clear, simple, and zero confusion.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Whether you need an honest technician in an hour, or you are looking for dependable work today, here is how everything runs safely.
            </p>

            {/* Dynamic Toggle */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200" id="roles">
                <button 
                  onClick={() => setActiveRole('hire')} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeRole === 'hire' ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>For Employers / Hiring</span>
                </button>
                <button 
                  onClick={() => setActiveRole('work')} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeRole === 'work' ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>For Workers / Job Seekers</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW A: FOR EMPLOYERS / HIRING */}
          {activeRole === 'hire' && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-300">
              
              {/* Step 1 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tell Us Who You Need</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Pick the job role (electrician, plumber, warehouse associate), job date and location. No complicated contracts or hidden booking charges.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#0066FF]" />
                  <span>Takes only 45 seconds to post</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Funds Stay Safe in Escrow</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  You pre-lock the daily wage in a secure platform vault. The money is never handed over upfront until the worker arrives and finishes their job properly.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>100% money back if worker no-shows</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Check In & Release Payment</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  The worker arrives with a clean photo badge. Once they finish their job, you confirm with a simple 4-digit mobile OTP to release the funds.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero payment arguments or friction</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW B: FOR WORKERS / JOB SEEKERS */}
          {activeRole === 'work' && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-300">
              
              {/* Worker Step 1 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Get Verified with Aadhaar / ID</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Upload your photo, government ID, and work experience once. Our team approves you in 2 hours so employers can trust your verified profile.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#0066FF]" />
                  <span>Free badges & safe membership</span>
                </div>
              </div>

              {/* Worker Step 2 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">1-Click Apply to Nearby Jobs</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  See open jobs near your home with clear wage numbers beforehand (e.g. ₹850/day). You know the exact job, location, and hours before saying yes.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-500" />
                  <span>Only jobs within 5 km to 10 km</span>
                </div>
              </div>

              {/* Worker Step 3 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Guaranteed Same-Day Payment</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  The wage is locked in escrow before you even step on site. The moment the day ends, money hits your UPI or bank account automatically. No begging for your hard-earned pay!
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>Direct to PhonePe / Google Pay / Bank</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: POPULAR JOBS & VERIFIED SKILLED WORKERS */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="popular-jobs">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold uppercase tracking-wider border border-blue-200">
                Popular Job Roles
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Find the right worker for every job.
              </h2>
              <p className="text-slate-600 text-base mt-1">
                Real photos of verified workers working across homes, offices, and logistics hubs.
              </p>
            </div>

            <Link to="/search" className="text-sm font-bold text-[#0066FF] hover:underline inline-flex items-center gap-1 group">
              <span>Browse all 40+ job categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="job-card bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1V-KC9nF7ATlICKsAgpI3kdfFTbQlH0n4FTWUz3LfIiUX7A9HTMEa0-rmmfuGWA2kK9JN2ljpWoj4wdUy4Ao1InCslfAG0sE3AsmRJ4tEdgdZomAKmuGcafOsbDbdfs3n6qVXp7RTsGfhtC0SwmrW5xGBpNj1yFN_b-sCk9AsoFPEeEFGgj5r6lrKdMhbOO6vJYC0JimQ_34n45UUP6ql4WbIiFXYBv969bYkjfxlM-QUsQiLeO063Ykpu9" alt="Master electrician testing control panel" className="w-full h-full object-cover object-center" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-600 flex items-center gap-1 shadow-xs">
                  <BadgeCheck className="w-3.5 h-3.5" /> <span>Certified Electrician</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                  ₹850 - ₹1,100 / day
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Electrical & Wiring Specialists</h3>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                    Short circuits, home wiring, commercial panels, inverter setups, and factory maintenance.
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 240 Available in City
                  </span>
                  <button onClick={() => navigate('/sign-up?role=employer')} className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer">Hire Worker &rarr;</button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="job-card bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1WyKUOnuUuld6Ab09bXGEJ_3KIPzynkUkxDuAPysVrhoIQfOGyIAaQqs4zXQhe4x2s_kwrwCDFcvX_xVI-tZeDKgV78yE5mi66W5Qitbv_euZ5W-b5UMlvmwhZITohTLOIH6goOf64W0yyvkO4lvFKHlGFtJ4z1NhBVyUB8_lt1VHBUdJrVHb69hKZbrPgMrKbgEL9O2mgDnF8gkWTkf3OGB-DYXuZ87D7aHOP7brMQe0xqFadEIX-w5E9i" alt="Modern warehouse fulfillment logistics" className="w-full h-full object-cover object-center" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0066FF] flex items-center gap-1 shadow-xs">
                  <Briefcase className="w-3.5 h-3.5" /> <span>Warehouse & Packers</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                  ₹700 - ₹950 / day
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Logistics, Sorting & Inventory</h3>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                    E-commerce packing, loading/unloading, forklift operators, and seasonal surge crews on short notice.
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 580 Available in City
                  </span>
                  <button onClick={() => navigate('/sign-up?role=employer')} className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer">Hire Worker &rarr;</button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="job-card bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1Xle3WKHP7eUaktG49hHl4-x8nyAOHLdgparmDhUcaQzwifc1PH0mWt0DiYADV14c1LDQI9LmX_IYpS269pUMezu2v-7w2KTCoItQX-PeEtukQZOX8bRJ3nUmMNKq3GkUL3UWdwlqKhfB9FSHXyqsIjQW1a5hRCyQqsNIwyuYrig0ktNP_9UeGKv2IQ7Wd-_v3kw9p-NLH2TnFk_IYpSzHngwxKB_ZYIXSYtNSOvmwcC3yWxbCSwX2K22k" alt="Collaborative industrial team" className="w-full h-full object-cover object-center" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1 shadow-xs">
                  <Wrench className="w-3.5 h-3.5" /> <span>Plumbers & Fitters</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-white">
                  ₹750 - ₹1,000 / day
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Plumbing & Facility Technicians</h3>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                    Pipe repairs, bathroom installations, motor pumps, carpentry maintenance, and site fitters.
                  </p>
                </div>
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 190 Available in City
                  </span>
                  <button onClick={() => navigate('/sign-up?role=employer')} className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer">Hire Worker &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: WHY PEOPLE TRUST US */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="benefits">
          
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 rounded-3xl text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-3xl -z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASJofa83rqahZjEDKORvqiKm6uWbIqpS9OB0-zvyETwTqX9I8vf_bjjt2ZP0hItPGMdZL_ng-FymjUCD8xHKWU8gSeuavfMbGmUhPdAURAoU_Y9gfqaxQDKGMxCg3WEkVs_FDRT95rHe_bVpLKElRlFHceoD_LV0CaB9LjHCI-OQzheVR3U4zL5aPDZ1W-nFyd9vgrG3ISE_JGEp3rJLN8cpS1fMz9la_O2LGRBxgYd219ufVkjtDZdw" alt="Smiling Indian worker receiving daily pay on smartphone" className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                    <p className="text-sm font-semibold text-white">"No more waiting 30 days for my wages."</p>
                    <p className="text-xs text-slate-300 mt-0.5">Ramesh Kumar • Electrician in Bengaluru (340+ jobs completed)</p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="lg:col-span-7 space-y-6">
                <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
                  100% Peace of Mind
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  We eliminated every headache of daily wage work.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-base text-white">Government ID Verified</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every worker is checked with official Aadhaar records and basic police clearance before booking.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-base text-white">Escrow Payment Vault</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Funds are safely locked before the job begins and only disbursed when both parties agree work was done.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-base text-white">₹5 Lakh Insurance Included</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every active job comes with automatic accidental medical coverage so workers are protected on the job.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-base text-white">24/7 Regional Phone Help</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Real people speaking Hindi, Kannada, Tamil, Telugu, and English ready on call for help anytime.
                    </p>
                  </div>

                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/sign-up?role=worker" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                    <span>Join TrustHyre Free Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-slate-400">No registration fee • Start in 5 minutes</span>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="mt-28 bg-white border-t border-slate-200 py-12 text-slate-600" id="faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-100 rounded-lg p-1">
                  <img src="/logo.png" alt="TrustHyre Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-black text-slate-900">Trust<span className="text-[#0066FF]">Hyre</span></span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The honest daily wage & skilled workforce platform built for India's hardworking technicians and growing businesses.
              </p>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 100% Escrow Insured
              </div>
            </div>

            {/* Quick Links: Employers */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">For Businesses & Homes</h5>
              <ul className="space-y-2 text-xs">
                <li><Link to="/sign-up?role=employer" className="hover:text-[#0066FF] transition-colors">Post an Urgent Job</Link></li>
                <li><Link to="/sign-up?role=employer" className="hover:text-[#0066FF] transition-colors">Hire Certified Electricians</Link></li>
                <li><Link to="/sign-up?role=employer" className="hover:text-[#0066FF] transition-colors">Warehouse & Logistics Crews</Link></li>
                <li><Link to="/sign-up?role=employer" className="hover:text-[#0066FF] transition-colors">How Escrow Protects You</Link></li>
              </ul>
            </div>

            {/* Quick Links: Workers */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">For Workers & Job Seekers</h5>
              <ul className="space-y-2 text-xs">
                <li><Link to="/sign-up?role=worker" className="hover:text-[#0066FF] transition-colors">Find Jobs Near Me</Link></li>
                <li><Link to="/sign-up?role=worker" className="hover:text-[#0066FF] transition-colors">Daily Payment & UPI Wallet</Link></li>
                <li><Link to="/sign-up?role=worker" className="hover:text-[#0066FF] transition-colors">Get ID Verification Badge</Link></li>
                <li><Link to="/sign-up?role=worker" className="hover:text-[#0066FF] transition-colors">Accident Insurance Policy</Link></li>
              </ul>
            </div>

            {/* Helpline & Support */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Need Help? Talk to Us</h5>
              <p className="text-xs text-slate-500 mb-2">Toll-free customer helpline available in 5 languages:</p>
              <p className="text-sm font-extrabold text-slate-900 mb-1">1800-419-8973</p>
              <p className="text-[11px] text-slate-400">support@trusthyre.com • 7 AM to 10 PM daily</p>
            </div>
          </div>

          {/* Bottom copyright & trust line */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>&copy; 2024 TrustHyre Technologies. Safe, Verified & Prompt Daily Payouts.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline">Terms of Service</Link>
              <Link to="/terms" className="hover:underline">Safety Guidelines</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
