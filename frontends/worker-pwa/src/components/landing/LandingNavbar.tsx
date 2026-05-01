import { Link } from "react-router-dom";
import { useAppSelector } from "../../store";

export function LandingNavbar() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <nav className="fixed top-0 w-full h-[72px] z-50 bg-[#F5F4EF]/80 backdrop-blur-md border-b border-[#1F3F34]/5 shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-[1440px] mx-auto h-full">
        <Link to="/" className="text-2xl font-black text-[#1F3F34] tracking-tighter bricolage">TrustHire</Link>
        <div className="hidden lg:flex items-center gap-10">
          <Link className="text-[#1F3F34] font-black text-[10px] uppercase tracking-widest border-b-2 border-[#FACD15] pb-1" to="/">For Workers</Link>
          <a className="text-[#1F3F34]/60 font-black text-[10px] uppercase tracking-widest hover:text-[#1F3F34] transition-colors" href="#how-it-works">Process</a>
          <a className="text-[#1F3F34]/60 font-black text-[10px] uppercase tracking-widest hover:text-[#1F3F34] transition-colors" href="#trust">Trust Matrix</a>
          <a className="text-[#1F3F34]/60 font-black text-[10px] uppercase tracking-widest hover:text-[#1F3F34] transition-colors" href="#impact">Impact</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-white border border-[#1F3F34]/5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
            <span className="text-[#FACD15] pr-2">EN</span>
            <span className="text-[#1F3F34]/10 px-1">|</span>
            <span className="text-[#1F3F34]/40 pl-2 cursor-pointer hover:text-[#1F3F34]">हिन्दी</span>
          </div>
          {isAuthenticated ? (
            <Link to="/dashboard" className="bg-[#1F3F34] text-[#FACD15] px-8 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#1F3F34]/10 hover:scale-105 transition-all active:scale-95">
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/sign-in" className="text-[#1F3F34] font-black text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-[#1F3F34]/5 transition-all">Login</Link>
              <Link to="/sign-up" className="bg-[#1F3F34] text-[#FACD15] px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#1F3F34]/10 hover:scale-105 transition-all active:scale-95">Register</Link>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
      `}</style>
    </nav>
  );
}
