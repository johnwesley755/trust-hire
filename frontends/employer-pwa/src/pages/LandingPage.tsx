import { SignedIn, SignedOut } from "../providers/AuthContext";
import { Link } from "react-router-dom";
import { Users, CheckCircle2, ShieldCheck, Zap, ArrowRight, Menu, X, Star } from "lucide-react";
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
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">TrustHire <span className="text-indigo-600">Employer</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">How it Works</a>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <SignedOut>
              <Link to="/sign-in" className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors">Sign In</Link>
              <Link to="/sign-up" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                Join Network
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                Dashboard
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
            <a href="#features" className="block text-slate-600 font-medium">Features</a>
            <a href="#how-it-works" className="block text-slate-600 font-medium">How it Works</a>
            <SignedOut>
              <Link to="/sign-in" className="block text-slate-900 font-semibold">Sign In</Link>
              <Link to="/sign-up" className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold">Get Started</Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold">Dashboard</Link>
            </SignedIn>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Revolutionizing Hiring
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Hire <span className="bg-linear-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Verified</span> Professionals <span className="text-indigo-600">Instantly.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              India's first premium platform for business owners. Aadhaar verified, face-matched, and performance-rated workers at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-up" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Start Hiring Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex -space-x-3 items-center ml-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-200">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" />
                  </div>
                ))}
                <div className="pl-6 text-sm">
                  <div className="flex text-amber-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-slate-600 font-medium">Trusted by 500+ Businesses</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2.5rem] blur-3xl"></div>
            <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white/20">
              <img 
                src="/assets/landing/hero-visual.png" 
                alt="TrustHire Platform" 
                className="rounded-[1.8rem] w-full shadow-inner"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs font-bold text-slate-500 uppercase">Verification Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
            {[
              { label: "Verified Workers", value: "25k+" },
              { label: "Active Employers", value: "1.2k+" },
              { label: "Cities Covered", value: "15+" },
              { label: "Job Retention", value: "94%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-extrabold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6 mb-20">
          <h2 className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-sm">Our Difference</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">The Future of <span className="text-indigo-600">Workforce Management.</span></h3>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Stop worrying about background checks and fake identities. We've built the ultimate trust layer.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "AI Face Identification", 
              desc: "Eliminate proxy attendance. Our system matches workers' live faces with government IDs in real-time.", 
              icon: <Users className="w-7 h-7" />,
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "Blockchain Verification", 
              desc: "Work history and ratings are secured on-chain, ensuring tamper-proof professional reputation.", 
              icon: <ShieldCheck className="w-7 h-7" />,
              color: "bg-indigo-50 text-indigo-600"
            },
            { 
              title: "Instant Job Filling", 
              desc: "Our matching algorithm finds the best available talent within minutes based on skill ratings and proximity.", 
              icon: <Zap className="w-7 h-7" />,
              color: "bg-amber-50 text-amber-600"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-400 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-inner`}>
                {feature.icon}
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <h3 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">Manage Your Entire Team <span className="text-indigo-400">from One Place.</span></h3>
            <div className="space-y-6">
              {[
                { title: "Smart Daily Check-ins", desc: "Geofenced attendance with biometric verification." },
                { title: "One-Click Payments", desc: "Pay your entire workforce securely with verified bank sync." },
                { title: "Performance Analytics", desc: "Track worker quality and efficiency over time." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xl">{item.title}</h5>
                    <p className="text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px]"></div>
            <img 
              src="/assets/landing/dashboard-mockup.png" 
              alt="Dashboard Mockup" 
              className="relative z-10 rounded-2xl shadow-2xl border border-white/10 opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>

      {/* Network Highlights */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="/assets/landing/workers-collage.png" 
              alt="Verified Workers" 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <h3 className="text-4xl font-extrabold text-slate-900 leading-tight">Elite Workforce Network, <span className="text-indigo-600 underline decoration-indigo-200">Pre-Vetted.</span></h3>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We don't just provide workers; we provide a professional network. Every worker on TrustHire passes a rigorous 4-step verification process before they can even view your job postings.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Identity Verification", "Skill Assessment", "Reference Checks", "Face Biometrics"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                  <div className="w-6 h-6 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/sign-up" className="inline-block px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl active:scale-95">
              Access the Network
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-indigo-600 w-8 h-8" />
              <span className="text-2xl font-bold tracking-tight text-slate-900">TrustHire</span>
            </div>
            <p className="text-slate-500 font-medium text-center md:text-left">Building the global standard for <br/> verified, professional labor.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4 text-center md:text-left">
              <h6 className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em]">Product</h6>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-indigo-600">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600">Verification</a></li>
                <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
              </ul>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h6 className="font-bold text-slate-900 uppercase text-xs tracking-[0.2em]">Support</h6>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600">Safety</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm font-medium">© 2026 TrustHire Technologies Inc. Built with love for professional business owners.</p>
        </div>
      </footer>
    </div>
  );
}

