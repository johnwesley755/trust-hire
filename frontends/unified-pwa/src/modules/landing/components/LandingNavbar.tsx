import { Link } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";
import logo from "../../../assets/logo.png";

interface LandingNavbarProps {
  mode?: 'employer' | 'worker';
  onToggleMode?: (mode: 'employer' | 'worker') => void;
}

export function LandingNavbar({ mode = 'employer', onToggleMode }: LandingNavbarProps) {
  const { isSignedIn, user } = useAuth();

  const targetDashboard = user?.role === 'WORKER' ? '/tracker' : '/dashboard';

  return (
    <nav className="fixed top-0 w-full h-[72px] z-50 bg-[#F5F4EF]/90 backdrop-blur-md border-b border-[#FACD15]/20 shadow-sm transition-all duration-300">
      <div className="h-1 bg-[#FACD15] absolute top-0 left-0 w-1/3 shadow-[0_0_10px_#FACD15]"></div>
      <div className="flex justify-between items-center px-6 md:px-12 h-full max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-300 border border-[#1F3F34]/10">
            <img src={logo} alt="TrustHire" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-black text-[#1F3F34] tracking-tight">TrustHire</span>
        </Link>

        {/* Role Switcher Pill in Navbar */}
        {onToggleMode && (
          <div className="hidden md:flex items-center bg-[#E9E8E3] p-1 rounded-full border border-[#1F3F34]/10">
            <button
              onClick={() => onToggleMode('employer')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                mode === 'employer'
                  ? 'bg-[#1F3F34] text-[#FACD15] shadow-sm'
                  : 'text-[#1F3F34]/60 hover:text-[#1F3F34]'
              }`}
            >
              For Employers
            </button>
            <button
              onClick={() => onToggleMode('worker')}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                mode === 'worker'
                  ? 'bg-[#1F3F34] text-[#FACD15] shadow-sm'
                  : 'text-[#1F3F34]/60 hover:text-[#1F3F34]'
              }`}
            >
              For Workers
            </button>
          </div>
        )}

        <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-[#1F3F34]/80">
          <Link className="hover:text-[#1F3F34] transition-colors" to="/find-workers">Find Workers</Link>
          <Link className="hover:text-[#1F3F34] transition-colors" to="/search">Find Jobs</Link>
          <Link className="hover:text-[#1F3F34] transition-colors" to="/help">Help & FAQ</Link>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link
              to={targetDashboard}
              className="bg-[#FACD15] text-[#1F3F34] font-extrabold px-6 py-2.5 rounded-xl uppercase text-xs tracking-wider shadow-[0_3px_0_0_#C39F00] hover:scale-105 active:scale-95 transition-all"
            >
              Go to Portal
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-[#1F3F34] font-bold px-4 py-2 hover:bg-[#FACD15]/10 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link
                to={`/sign-up?role=${mode === 'worker' ? 'WORKER' : 'EMPLOYER'}`}
                className="bg-[#FACD15] text-[#1F3F34] font-extrabold px-6 py-2.5 rounded-xl uppercase text-xs tracking-wider shadow-[0_3px_0_0_#C39F00] hover:scale-105 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
