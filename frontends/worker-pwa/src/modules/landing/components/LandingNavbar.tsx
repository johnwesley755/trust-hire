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
      <nav className="fixed top-0 w-full h-[72px] z-50 bg-white/90 backdrop-blur-md border-b-2 border-primary-fixed/20 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-12 w-full max-w-[1440px] mx-auto h-full">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-300">
              <img src={logo} alt="TrustHire" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl md:text-2xl font-black text-primary tracking-tight">TrustHire</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link className="text-on-surface font-bold border-b-2 border-primary-fixed pb-1" to="/workers">For Workers</Link>
            <a className="text-on-surface/70 hover:text-on-surface transition-colors" href="#how-it-works">How It Works</a>
            <a className="text-on-surface/70 hover:text-on-surface transition-colors" href="#success-stories">Success Stories</a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Translation */}
            <div className="hidden md:flex items-center bg-primary-fixed/10 rounded-full px-3 py-1 border border-primary/10">
              <select 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent text-[10px] font-bold text-primary focus:outline-none cursor-pointer"
              >
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="ml">Malayalam</option>
                <option value="kn">Kannada</option>
                <option value="mr">Marathi</option>
                <option value="bn">Bengali</option>
              </select>
              <div className="w-[1px] h-3 bg-primary/20 mx-1"></div>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-translation'))}
                disabled={isTranslating}
                className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary-fixed transition-colors disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${isTranslating ? 'animate-spin' : ''}`}>translate</span>
                {isTranslating ? '...' : 'Translate'}
              </button>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isSignedIn ? (
                <Link to="/dashboard" className="bg-primary-fixed text-primary px-8 py-2 rounded-[12px] font-bold uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] hover:brightness-105 transition-all">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/sign-in" className="text-primary font-bold border-2 border-primary px-6 py-2 rounded-[12px] hover:bg-primary hover:text-white transition-all text-sm">Login</Link>
                  <Link to="/sign-up" className="bg-primary-fixed text-primary px-6 py-2 rounded-[12px] font-bold uppercase text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] hover:brightness-105 transition-all text-sm">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[60] bg-primary/20 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black text-primary tracking-tight">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6 mb-10">
              <Link onClick={() => setIsMenuOpen(false)} to="/workers" className="block text-lg font-bold text-on-surface">For Workers</Link>
              <a onClick={() => setIsMenuOpen(false)} href="#how-it-works" className="block text-lg font-bold text-on-surface">How It Works</a>
              <a onClick={() => setIsMenuOpen(false)} href="#success-stories" className="block text-lg font-bold text-on-surface">Success Stories</a>
            </div>

            <div className="mt-auto border-t border-on-surface/10 pt-6">
              {/* Mobile Translation */}
              <div className="mb-8">
                <p className="text-[10px] font-black text-on-surface/40 uppercase tracking-widest mb-4">Language Settings</p>
                <div className="flex flex-col gap-3">
                  <select 
                    value={targetLang} 
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-primary-fixed/10 border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold text-primary"
                  >
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ml">Malayalam (മലയാളം)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="mr">Marathi (मరాठी)</option>
                    <option value="bn">Bengali (বাংলা)</option>
                  </select>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('trigger-translation'));
                      setIsMenuOpen(false);
                    }}
                    disabled={isTranslating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-fixed text-primary rounded-xl text-sm font-black uppercase disabled:opacity-50 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">translate</span>
                    {isTranslating ? 'Translating...' : 'Translate Page'}
                  </button>
                  <button onClick={resetTranslations} className="text-xs font-bold text-on-surface/50 uppercase tracking-wider mt-1 underline text-center">
                    Reset to English
                  </button>
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="flex flex-col gap-3">
                {isSignedIn ? (
                  <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className="bg-primary-fixed text-primary w-full py-4 text-center rounded-xl font-black uppercase tracking-wider shadow-md">Dashboard</Link>
                ) : (
                  <>
                    <Link onClick={() => setIsMenuOpen(false)} to="/sign-in" className="w-full py-4 text-center text-primary font-bold border-2 border-primary rounded-xl">Login</Link>
                    <Link onClick={() => setIsMenuOpen(false)} to="/sign-up" className="bg-primary-fixed text-primary w-full py-4 text-center rounded-xl font-black uppercase tracking-wider shadow-md">Get Started</Link>
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
