import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../providers/AuthContext";
import { useLanguage } from "../../../providers/LanguageContext";
import logo from "../../../assets/logo.png";

export function LandingNavbar() {
  const { isSignedIn } = useAuth();
  const { targetLang, setTargetLang, isTranslating, resetTranslations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full h-[72px] z-50 bg-white/90 backdrop-blur-md border-b border-brand-amber/20 shadow-sm">
        <div className="h-1 bg-brand-amber absolute top-0 left-0 w-1/4 shadow-[0_0_10px_#FACD15]"></div>
        <div className="flex justify-between items-center px-4 md:px-12 h-full max-w-[1440px] mx-auto">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-300">
              <img src={logo} alt="TrustHire" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl md:text-2xl font-black text-brand-forest tracking-tight">TrustHire</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a className="text-brand-forest font-bold border-b-2 border-brand-amber pb-1 text-sm" href="#how-it-works">How It Works</a>
            <Link className="text-brand-forest/70 hover:text-brand-forest transition-colors text-sm" to="/search">Browse Workers</Link>
            <a className="text-brand-forest/70 hover:text-brand-forest transition-colors text-sm" href="#pricing">Pricing</a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Translation Controls */}
            <div className="hidden md:flex items-center gap-2 bg-brand-forest/5 rounded-full px-3 py-1 border border-brand-forest/10">
              <select 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent text-[10px] font-bold text-brand-forest focus:outline-none cursor-pointer"
              >
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="ml">Malayalam</option>
                <option value="kn">Kannada</option>
                <option value="mr">Marathi</option>
                <option value="bn">Bengali</option>
              </select>
              <div className="w-[1px] h-3 bg-brand-forest/20"></div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-translation'))}
                disabled={isTranslating}
                className="flex items-center gap-1.5 text-[10px] font-black text-brand-forest hover:text-brand-amber transition-colors disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${isTranslating ? 'animate-spin' : ''}`}>translate</span>
                {isTranslating ? '...' : 'Translate'}
              </button>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isSignedIn ? (
                <Link to="/dashboard" className="btn-primary px-8 py-2.5 uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">Dashboard</Link>
              ) : (
                <>
                  <Link to="/sign-in" className="text-brand-forest font-bold px-4 py-2 text-sm">Login</Link>
                  <Link to="/sign-up" className="btn-primary px-6 py-2.5 uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-brand-forest"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] bg-brand-forest/20 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black text-brand-forest tracking-tight">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-brand-forest">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <a onClick={() => setIsMenuOpen(false)} href="#how-it-works" className="block text-lg font-bold text-brand-forest">How It Works</a>
              <Link onClick={() => setIsMenuOpen(false)} to="/search" className="block text-lg font-bold text-brand-forest">Browse Workers</Link>
              <a onClick={() => setIsMenuOpen(false)} href="#pricing" className="block text-lg font-bold text-brand-forest">Pricing</a>
            </div>

            <div className="mt-auto border-t border-brand-forest/10 pt-6">
              {/* Mobile Translation */}
              <div className="mb-8">
                <p className="text-[10px] font-black text-brand-forest/40 uppercase tracking-widest mb-4">Language Settings</p>
                <div className="flex flex-col gap-3">
                  <select 
                    value={targetLang} 
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-brand-forest/5 border border-brand-forest/10 rounded-xl px-4 py-3 text-sm font-bold text-brand-forest"
                  >
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ml">Malayalam (മലയാളം)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="bn">Bengali (বাংলা)</option>
                  </select>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('trigger-translation'));
                      setIsMenuOpen(false);
                    }}
                    disabled={isTranslating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-forest text-brand-amber rounded-xl text-sm font-black uppercase disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">translate</span>
                    {isTranslating ? 'Translating...' : 'Translate Page'}
                  </button>
                  <button onClick={resetTranslations} className="text-xs font-bold text-brand-forest/50 uppercase tracking-wider mt-1 underline">
                    Reset to English
                  </button>
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="flex flex-col gap-3">
                {isSignedIn ? (
                  <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className="btn-primary w-full py-4 text-center uppercase font-black tracking-wider">Dashboard</Link>
                ) : (
                  <>
                    <Link onClick={() => setIsMenuOpen(false)} to="/sign-in" className="w-full py-4 text-center text-brand-forest font-bold border border-brand-forest/20 rounded-xl">Login</Link>
                    <Link onClick={() => setIsMenuOpen(false)} to="/sign-up" className="btn-primary w-full py-4 text-center uppercase font-black tracking-wider">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
