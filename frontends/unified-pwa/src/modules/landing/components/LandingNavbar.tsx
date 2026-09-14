import { Link } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";
import logo from "../../../assets/logo.png";
import { MapPin, ChevronDown, Search, ShieldCheck } from "lucide-react";

export function LandingNavbar() {
  const { isSignedIn, user } = useAuth();

  const targetDashboard = user?.role === 'EMPLOYER' ? '/dashboard' : '/search';

  return (
    <nav className="fixed top-0 w-full h-[72px] z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(10,25,49,0.04)] transition-all duration-300">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-12 h-full max-w-[1440px] mx-auto gap-4">
        
        {/* Brand & Hyperlocal Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-300 border border-slate-200">
              <img src={logo} alt="TrustHyre" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-black text-[#0A1931] tracking-tight leading-none block font-headline">TrustHyre</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#0066FF]">Trusted Talent • Better Hiring</span>
            </div>
          </Link>

          {/* Swiggy/Zomato style location pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full cursor-pointer transition-colors border border-slate-200/60">
            <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
            <span className="text-xs font-black text-[#0A1931] truncate max-w-[160px]">HSR Layout, Bengaluru</span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">⚡ 30m match</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#0A1931]/70">
          <Link className="hover:text-[#0066FF] transition-colors flex items-center gap-1.5" to="/search">
            <span className="material-symbols-outlined text-base">work</span>
            Find Jobs
          </Link>
          <Link className="hover:text-[#0066FF] transition-colors flex items-center gap-1.5" to="/find-workers">
            <span className="material-symbols-outlined text-base">badge</span>
            Hire Workers
          </Link>
          <Link className="hover:text-[#0066FF] transition-colors flex items-center gap-1.5" to="/help">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Escrow Shield
          </Link>
        </div>

        {/* Right Action Switcher */}
        <div className="flex items-center gap-2.5">
          {isSignedIn ? (
            <Link
              to={targetDashboard}
              className="bg-[#0066FF] hover:bg-[#0050CB] text-white font-extrabold px-5 py-2.5 rounded-xl uppercase text-xs tracking-wider shadow-md shadow-[#0066FF]/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              {user?.role === 'EMPLOYER' ? 'Employer Workspace' : 'Jobs Portal'}
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in?role=WORKER"
                className="inline-flex text-[#0A1931] font-extrabold px-4 py-2 hover:bg-slate-100 rounded-xl transition-all text-xs uppercase tracking-wider items-center gap-1.5"
              >
                Candidate Login
              </Link>
              <Link
                to="/sign-in?role=EMPLOYER"
                className="bg-[#0A1931] hover:bg-[#0F172A] text-white font-extrabold px-4.5 py-2.5 rounded-xl uppercase text-xs tracking-wider active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm text-[#38BDF8]">business</span>
                Employer Portal
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
