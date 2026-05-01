import { Link } from "react-router-dom";
import { useAppSelector } from "../../store";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

export function LandingNavbar() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <nav className="fixed top-0 w-full h-[72px] z-50 bg-white/80 backdrop-blur-md border-b border-[#FACD15]/20 shadow-sm transition-all duration-300">
      <div className="h-1 bg-[#FACD15] absolute top-0 left-0 w-1/4 shadow-[0_0_10px_#FACD15]"></div>
      <div className="flex justify-between items-center px-6 md:px-12 h-full max-w-[1440px] mx-auto">
        <Link to="/" className="text-2xl font-black text-[#1F3F34] tracking-tight uppercase bricolage">TrustHire</Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a className="text-[#1F3F34] font-black border-b-2 border-[#FACD15] pb-1 uppercase tracking-tighter text-sm" href="#how-it-works">How It Works</a>
          <Link className="text-[#1F3F34]/70 hover:text-[#1F3F34] transition-colors text-[10px] font-black uppercase tracking-widest" to="/find-workers">Browse Workers</Link>
          <a className="text-[#1F3F34]/70 hover:text-[#1F3F34] transition-colors text-[10px] font-black uppercase tracking-widest" href="#pricing">Pricing</a>
          <a className="text-[#1F3F34]/70 hover:text-[#1F3F34] transition-colors text-[10px] font-black uppercase tracking-widest" href="#workers">For Workers</a>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className="bg-[#FACD15] text-[#1F3F34] px-8 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#FACD15]/10 hover:scale-105 active:scale-95 flex items-center justify-center transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in" className="text-[#1F3F34] font-black px-4 py-2 hover:bg-[#F5F4EF] rounded-xl transition-all text-[10px] uppercase tracking-widest">Login</Link>
              <Link to="/sign-up" className="bg-[#FACD15] text-[#1F3F34] px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#FACD15]/10 hover:scale-105 active:scale-95 flex items-center justify-center transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
