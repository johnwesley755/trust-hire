import { Link } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";
import logo from "../../../assets/logo.png";

export function LandingNavbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 w-full h-[72px] z-50 bg-white/80 backdrop-blur-md border-b-2 border-primary-fixed/20 shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-[1440px] mx-auto h-full">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-300">
            <img src={logo} alt="TrustHire" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-black text-primary tracking-tight">TrustHire</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          <Link className="text-on-surface font-bold border-b-2 border-primary-fixed pb-1" to="/workers">For Workers</Link>
          <a className="text-on-surface/70 hover:text-on-surface transition-colors" href="#how-it-works">How It Works</a>
          <a className="text-on-surface/70 hover:text-on-surface transition-colors" href="#success-stories">Success Stories</a>
          <a className="text-on-surface/70 hover:text-on-surface transition-colors" href="#pricing">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-surface-container rounded-full px-3 py-1 text-sm font-bold">
            <span className="text-primary pr-2">EN</span>
            <span className="text-on-surface/30 px-1">|</span>
            <span className="text-on-surface/50 pl-2 cursor-pointer hover:text-on-surface">हिन्दी</span>
          </div>
          {isSignedIn ? (
            <Link to="/dashboard" className="bg-primary-fixed text-primary px-8 py-2 rounded-[12px] font-bold uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] hover:brightness-105 transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in" className="text-primary font-bold border-2 border-primary px-6 py-2 rounded-[12px] hover:bg-primary hover:text-white transition-all">Login</Link>
              <Link to="/sign-up" className="bg-primary-fixed text-primary px-6 py-2 rounded-[12px] font-bold uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] hover:brightness-105 transition-all">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
