import { SignedIn, SignedOut } from "../providers/AuthContext";
import { Link } from "react-router-dom";
import { Award, ShieldCheck, Zap, ArrowRight, Menu, X, Star, Wallet, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-header py-3 shadow-md' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Award className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">TrustHire <span className="text-emerald-600">Pro</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Benefits</a>
            <a href="#levels" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Career Levels</a>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <SignedOut>
              <Link to="/sign-in" className="text-slate-900 font-semibold hover:text-emerald-600 transition-colors">Sign In</Link>
              <Link to="/sign-up" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                Apply Now
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                My Dashboard
              </Link>
            </SignedIn>
          </div>

          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-4 shadow-xl animate-fade-in-up">
            <a href="#benefits" className="block text-slate-600 font-medium">Benefits</a>
            <a href="#levels" className="block text-slate-600 font-medium">Career Levels</a>
            <SignedOut>
              <Link to="/sign-in" className="block text-slate-900 font-semibold">Sign In</Link>
              <Link to="/sign-up" className="block w-full text-center py-3 bg-emerald-600 text-white rounded-xl font-semibold">Join as Pro</Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="block w-full text-center py-3 bg-emerald-600 text-white rounded-xl font-semibold">Dashboard</Link>
            </SignedIn>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 uppercase tracking-wider">
              <Star className="w-4 h-4 fill-current" />
              Top Rated Work
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Your Professional <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Career</span> Starts <span className="text-emerald-600">Here.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Join India's most trusted network of verified service professionals. Get premium jobs, instant payouts, and build a verified work history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-up" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Apply as a Professional
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-105">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-slate-900">100% Verified</p>
                   <p className="text-xs text-slate-500 font-medium">Safe & Secure Platform</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-[2.5rem] blur-3xl"></div>
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white/20">
              <img 
                src="/assets/landing/hero-worker.png" 
                alt="TrustHire Worker App" 
                className="rounded-[1.8rem] w-full shadow-inner"
              />
            </div>
            {/* Floating Earnings */}
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">₹2,450</p>
                <p className="text-xs font-bold text-slate-500 uppercase">Today's Earnings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section id="benefits" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-sm">Why Professional Join Us</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Better Jobs, <span className="text-emerald-600">Better Future.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Premium Earnings", 
                desc: "Verified professionals earn up to 40% more than average market rates. No middlemen, no commissions.", 
                icon: <Zap className="w-7 h-7" />,
                color: "bg-emerald-50 text-emerald-600"
              },
              { 
                title: "Reputation Score", 
                desc: "Every job builds your verified history. High ratings unlock exclusive, high-paying corporate contracts.", 
                icon: <Award className="w-7 h-7" />,
                color: "bg-amber-50 text-amber-600"
              },
              { 
                title: "Smart Job Finding", 
                desc: "Get notified of jobs near you that match your exact skills. Apply with one tap to verified employers.", 
                icon: <MapPin className="w-7 h-7" />,
                color: "bg-blue-50 text-blue-600"
              }
            ].map((benefit, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl">
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-8`}>
                  {benefit.icon}
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Showcase */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-[100px]"></div>
            <img 
              src="/assets/landing/earnings-visual.png" 
              alt="Earnings Wallet" 
              className="relative z-10 rounded-3xl shadow-2xl border border-white/10"
            />
          </div>
          <div className="space-y-8">
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight">Instant Payouts, <span className="text-emerald-400">Zero Wait.</span></h3>
            <p className="text-lg text-slate-400 font-medium">
              We know your time is money. Our direct bank settlement ensures you get paid as soon as the job is marked complete by the employer.
            </p>
            <div className="space-y-4">
              {["Daily Bank Settlements", "Transparent Pay Structure", "Bonus For Top Ratings"].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 font-bold">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Levels */}
      <section id="levels" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 space-y-8">
            <h3 className="text-4xl font-extrabold text-slate-900 leading-tight">Climb the <span className="text-emerald-600 underline decoration-emerald-200">Career Ladder</span>.</h3>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Start as an L1 (Entry) pro and grow your levels by completing jobs and training. High-level workers get access to bigger projects and better benefits.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-3xl border border-emerald-100 shadow-sm">
                <p className="text-emerald-600 font-bold mb-1">L1 - Foundation</p>
                <p className="text-xs text-slate-500 font-bold uppercase">Entry level projects</p>
              </div>
              <div className="p-6 bg-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-500/20">
                <p className="font-bold mb-1">L4 - Master</p>
                <p className="text-xs text-white/70 font-bold uppercase">Premium Contracts</p>
              </div>
            </div>
            <Link to="/sign-up" className="inline-block px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95">
              Build Your Profile
            </Link>
          </div>
          <div className="w-full lg:w-1/2">
            <img 
              src="/assets/landing/success-worker.png" 
              alt="Successful Professional" 
              className="rounded-3xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Award className="text-emerald-600 w-8 h-8" />
              <span className="text-2xl font-bold tracking-tight text-slate-900">TrustHire Pro</span>
            </div>
            <p className="text-slate-500 font-medium text-center md:text-left">Building the global standard for <br/> verified, professional labor.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <h6 className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em]">For Workers</h6>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-emerald-600">Find Jobs</a></li>
                <li><a href="#" className="hover:text-emerald-600">Levels & Stats</a></li>
                <li><a href="#" className="hover:text-emerald-600">Skill Tests</a></li>
              </ul>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h6 className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em]">Network</h6>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-emerald-600">Safety</a></li>
                <li><a href="#" className="hover:text-emerald-600">Verification</a></li>
                <li><a href="#" className="hover:text-emerald-600">Community</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 TrustHire Pro Inc. Empowering local talent with global trust standards.</p>
        </div>
      </footer>
    </div>
  );
}

