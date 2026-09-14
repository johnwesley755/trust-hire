import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<'hire' | 'work'>('hire');

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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src="/logo.png" alt="TrustHyre Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Trust<span className="text-brand-500">Hyre</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">VERIFIED WORKFORCE</span>
              </div>
            </Link>

            {/* Simple Layman Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <a href="#how-it-works" className="hover:text-brand-500 transition-colors">How It Works</a>
              <a href="#popular-jobs" className="hover:text-brand-500 transition-colors">Jobs & Trades</a>
              <a href="#benefits" className="hover:text-brand-500 transition-colors">Why People Trust Us</a>
              <a href="#faq" className="hover:text-brand-500 transition-colors">Help & FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3.5">
            <Link to="/sign-in?role=worker" className="hidden sm:inline-flex px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors items-center gap-1.5 border border-slate-200 bg-white shadow-sm">
              <span className="material-symbols-outlined text-lg">badge</span>
              Candidate Login
            </Link>
            <Link to="/sign-in?role=employer" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">business_center</span>
              Employer Login
            </Link>
          </div>
        </div>
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
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-600 text-xs font-bold tracking-wide uppercase shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                  Fast, Guaranteed & Honest
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Get Trusted Workers. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">Find Daily Shifts.</span> <br />
                  Paid Right on Time.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 font-body max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  No middleman delays, no unfair cuts. TrustHyre connects everyday businesses with verified skilled electricians, plumbers, warehouse staff, and technicians with guaranteed safe payments.
                </p>

                {/* Dual Simple Action Pill Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to="/sign-up?role=employer" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2.5 group transition-all hover:scale-[1.02]">
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">person_search</span>
                    I Need to Hire Workers
                  </Link>
                  <Link to="/sign-up?role=worker" className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-base shadow-sm flex items-center justify-center gap-2.5 hover:border-brand-500 hover:text-brand-500 transition-all hover:scale-[1.02]">
                    <span className="material-symbols-outlined text-emerald-600">payments</span>
                    I Want Daily Shifts & Work
                  </Link>
                </div>

                {/* Trust proof badges in simple terms */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                    <span>Government ID Checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-500 text-lg">lock</span>
                    <span>Safe Money Escrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">schedule</span>
                    <span>Same-Day Direct Payout</span>
                  </div>
                </div>
              </div>

              {/* Right Content: Rich Genuine Worker Photography with Overlaid Floating Live Cards */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                  {/* Actual Generated Real High-Res Photography */}
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Lj0Ng7SlNWBdmMHa5JbtqPxAzSkk5KG_RFvduc7waqQtB4DN3_HEfqsTldQxZLEOkxojWUBJnoDLPK4KiLN6hrLuoYeGJb1DIOPPlYfvgLwGZYLPjtX2PY2gDaQekUhbNa1EuXYcf1sg0KoqbBPR4uegU3U_xOHPzsijIaarOvf56Lh1mGyrZsRme0ZxUwmzAgj688Ppm4OS6doU5acw0nAfjnzTODKZKt8YuZa7OeaCDHCBvQ8fEQ" alt="Real friendly blue collar workers team" className="w-full h-[420px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  {/* Bottom caption on image */}
                  <div className="absolute bottom-4 left-5 right-5 text-white flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span> Over 140,000+ Active Pros
                      </p>
                      <p className="text-xs text-white/80">From local neighborhood repairs to factory shifts</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-xs font-extrabold uppercase tracking-wide text-white">4.9 ★ Rated</span>
                  </div>
                </div>

                {/* Floating Interactive Card 1: Worker Instant Payment Proof */}
                <div className="absolute -top-5 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[260px] animate-float">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Daily Shift Completed</span>
                    <p className="text-sm font-extrabold text-slate-900">₹1,200 Transferred</p>
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">done_all</span> Instant UPI Paid
                    </p>
                  </div>
                </div>

                {/* Floating Interactive Card 2: 15-Minute Fast Arrival */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[240px] animate-float-delayed">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-brand-500 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">near_me</span>
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
        {/* SECTION 2: HOW IT WORKS - DEAD SIMPLE STEPS (FOR WORKERS & EMPLOYERS) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="how-it-works">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Easy 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clear, simple, and zero confusion.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Whether you need an honest electrician in an hour, or you are looking for dependable work today, here is how everything runs safely.
            </p>

            {/* Dynamic Toggle for Layman switching */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200" id="roles">
                <button 
                  onClick={() => setActiveRole('hire')} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeRole === 'hire' ? 'bg-[#0066ff] text-white shadow-[0_8px_20px_-4px_rgba(0,102,255,0.4)]' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <span className="material-symbols-outlined text-lg">business_center</span>
                  For Employers / Hiring
                </button>
                <button 
                  onClick={() => setActiveRole('work')} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeRole === 'work' ? 'bg-[#0066ff] text-white shadow-[0_8px_20px_-4px_rgba(0,102,255,0.4)]' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <span className="material-symbols-outlined text-lg">handyman</span>
                  For Workers / Shifts
                </button>
              </div>
            </div>
          </div>

          {/* VIEW A: FOR EMPLOYERS / HIRING */}
          {activeRole === 'hire' && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-300">
              
              {/* Step 1 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-500 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tell Us Who You Need</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Pick the trade (electrician, plumber, warehouse crew), pick the shift date and location. No complicated contracts or hidden booking charges.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-500 text-base">timer</span>
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
                  You pre-lock the daily wage in a secure platform vault. The money is never handed over upfront until the worker arrives and finishes their shift properly.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-base">shield</span>
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
                  The worker arrives with a clean photo badge. Once they finish their shift, you confirm with a simple 4-digit mobile OTP to release the funds.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-base">sentiment_very_satisfied</span>
                  <span>Zero payment arguments or friction</span>
                </div>
              </div>
            </div>
          )}

          {/* VIEW B: FOR WORKERS / SHIFTS */}
          {activeRole === 'work' && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-300">
              
              {/* Worker Step 1 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-500 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Get Verified with Aadhaar / ID</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Upload your photo, government ID, and trade experience once. Our team approves you in 2 hours so employers can trust you instantly.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-500 text-base">verified</span>
                  <span>Free badges & safe membership</span>
                </div>
              </div>

              {/* Worker Step 2 */}
              <div className="step-card bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">1-Click Apply to Nearby Shifts</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  See open shifts near your home with clear wage numbers beforehand (e.g. ₹850/day). You know the exact job, location, and hours before saying yes.
                </p>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-base">navigation</span>
                  <span>Only shifts within 5 km to 10 km</span>
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
                  <span className="material-symbols-outlined text-emerald-600 text-base">paid</span>
                  <span>Direct to PhonePe / Google Pay / Bank</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: POPULAR TRADES & VERIFIED SKILLED PROS */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="popular-jobs">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-blue-200">
                Everyday Trades & Gigs
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Find the right person for every job.
              </h2>
              <p className="text-slate-600 text-base mt-1">
                Real photos of verified pros working across homes, shops, and large logistics plants.
              </p>
            </div>

            <Link to="/search" className="text-sm font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1 group">
              Browse all 40+ job categories
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="trade-card bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1V-KC9nF7ATlICKsAgpI3kdfFTbQlH0n4FTWUz3LfIiUX7A9HTMEa0-rmmfuGWA2kK9JN2ljpWoj4wdUy4Ao1InCslfAG0sE3AsmRJ4tEdgdZomAKmuGcafOsbDbdfs3n6qVXp7RTsGfhtC0SwmrW5xGBpNj1yFN_b-sCk9AsoFPEeEFGgj5r6lrKdMhbOO6vJYC0JimQ_34n45UUP6ql4WbIiFXYBv969bYkjfxlM-QUsQiLeO063Ykpu9" alt="Master electrician testing control panel" className="w-full h-full object-cover object-center" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-600 flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs">verified</span> Certified Electrician
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
                  <button onClick={() => navigate('/sign-up?role=employer')} className="text-xs font-bold text-brand-500 hover:underline">Book Shift &rarr;</button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="trade-card bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1WyKUOnuUuld6Ab09bXGEJ_3KIPzynkUkxDuAPysVrhoIQfOGyIAaQqs4zXQhe4x2s_kwrwCDFcvX_xVI-tZeDKgV78yE5mi66W5Qitbv_euZ5W-b5UMlvmwhZITohTLOIH6goOf64W0yyvkO4lvFKHlGFtJ4z1NhBVyUB8_lt1VHBUdJrVHb69hKZbrPgMrKbgEL9O2mgDnF8gkWTkf3OGB-DYXuZ87D7aHOP7brMQe0xqFadEIX-w5E9i" alt="Modern warehouse fulfillment logistics" className="w-full h-full object-cover object-center" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-600 flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs">forklift</span> Warehouse & Packers
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
                  <button onClick={() => navigate('/sign-up?role=employer')} className="text-xs font-bold text-brand-500 hover:underline">Book Shift &rarr;</button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="trade-card bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1Xle3WKHP7eUaktG49hHl4-x8nyAOHLdgparmDhUcaQzwifc1PH0mWt0DiYADV14c1LDQI9LmX_IYpS269pUMezu2v-7w2KTCoItQX-PeEtukQZOX8bRJ3nUmMNKq3GkUL3UWdwlqKhfB9FSHXyqsIjQW1a5hRCyQqsNIwyuYrig0ktNP_9UeGKv2IQ7Wd-_v3kw9p-NLH2TnFk_IYpSzHngwxKB_ZYIXSYtNSOvmwcC3yWxbCSwX2K22k" alt="Collaborative industrial team" className="w-full h-full object-cover object-center" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs">plumbing</span> Plumbers & Fitters
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
                  <button onClick={() => navigate('/sign-up?role=employer')} className="text-xs font-bold text-brand-500 hover:underline">Book Shift &rarr;</button>
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
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASJofa83rqahZjEDKORvqiKm6uWbIqpS9OB0-zvyETwTqX9I8vf_bjjt2ZP0hItPGMdZL_ng-FymjUCD8xHKWU8gSeuavfMbGmUhPdAURAoU_Y9gfqaxQDKGMxCg3WEkVs_FDRT95rHe_bVpLKElRlFHceoD_LV0CaB9LjHCI-OQzheVR3U4zL5aPDZ1W-nFyd9vgrG3ISE_JGEp3rJLN8cpS1fMz9la_O2LGRBxgYd219ufVkjtDZdw" alt="Smiling Indian worker receiving daily pay on smartphone" className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                    <p className="text-sm font-semibold text-white">"No more waiting 30 days for my wages."</p>
                    <p className="text-xs text-slate-300 mt-0.5">Ramesh Kumar • Electrician in Bengaluru (340+ shifts)</p>
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
                      <span className="material-symbols-outlined text-lg">verified_user</span>
                    </div>
                    <h4 className="font-bold text-base text-white">Government ID Verified</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every worker is checked with official Aadhaar records and basic police clearance before booking.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-lg">account_balance</span>
                    </div>
                    <h4 className="font-bold text-base text-white">Escrow Payment Vault</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Funds are safely locked before the shift begins and only disbursed when both parties agree work was done.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-lg">security</span>
                    </div>
                    <h4 className="font-bold text-base text-white">₹5 Lakh Insurance Included</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every active shift comes with automatic accidental medical coverage so workers are protected on the job.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1.5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-lg">support_agent</span>
                    </div>
                    <h4 className="font-bold text-base text-white">24/7 Regional Phone Help</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Real people speaking Hindi, Kannada, Tamil, Telugu, and English ready on call for help anytime.
                    </p>
                  </div>

                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/sign-up?role=worker" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                    <span>Join TrustHyre Free Today</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
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
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/logo.png" alt="TrustHyre Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-black text-slate-900">Trust<span className="text-brand-500">Hyre</span></span>
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
                <li><Link to="/sign-up?role=employer" className="hover:text-brand-500 transition-colors">Post an Urgent Shift</Link></li>
                <li><Link to="/sign-up?role=employer" className="hover:text-brand-500 transition-colors">Hire Certified Electricians</Link></li>
                <li><Link to="/sign-up?role=employer" className="hover:text-brand-500 transition-colors">Warehouse & Logistics Crews</Link></li>
                <li><Link to="/sign-up?role=employer" className="hover:text-brand-500 transition-colors">How Escrow Protects You</Link></li>
              </ul>
            </div>

            {/* Quick Links: Workers */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">For Workers & Trades</h5>
              <ul className="space-y-2 text-xs">
                <li><Link to="/sign-up?role=worker" className="hover:text-brand-500 transition-colors">Find Shifts Near Me</Link></li>
                <li><Link to="/sign-up?role=worker" className="hover:text-brand-500 transition-colors">Daily Payment & UPI Wallet</Link></li>
                <li><Link to="/sign-up?role=worker" className="hover:text-brand-500 transition-colors">Get ID Verification Badge</Link></li>
                <li><Link to="/sign-up?role=worker" className="hover:text-brand-500 transition-colors">Accident Insurance Policy</Link></li>
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
