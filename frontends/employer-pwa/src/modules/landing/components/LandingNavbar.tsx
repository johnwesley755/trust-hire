import { Link } from "react-router-dom";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full h-[72px] z-50 bg-white/80 backdrop-blur-md border-b border-brand-amber/20 shadow-sm transition-all duration-300">
      <div className="h-1 bg-brand-amber absolute top-0 left-0 w-1/4 shadow-[0_0_10px_#FACD15]"></div>
      <div className="flex justify-between items-center px-6 md:px-12 h-full max-w-[1440px] mx-auto">
        <Link to="/" className="text-2xl font-black text-brand-forest tracking-tight">TrustHire</Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a className="text-brand-forest font-bold border-b-2 border-brand-amber pb-1" href="#how-it-works">How It Works</a>
          <Link className="text-brand-forest/70 hover:text-brand-forest transition-colors text-sm" to="/search">Browse Workers</Link>
          <a className="text-brand-forest/70 hover:text-brand-forest transition-colors text-sm" href="#pricing">Pricing</a>
          <a className="text-brand-forest/70 hover:text-brand-forest transition-colors text-sm" href="#workers">For Workers</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/sign-in" className="text-brand-forest font-bold px-4 py-2 hover:bg-emerald-50/50 rounded-[12px] transition-all text-sm">Login</Link>
          <Link to="/sign-up" className="btn-primary px-6 py-2.5 uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 flex items-center justify-center">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
