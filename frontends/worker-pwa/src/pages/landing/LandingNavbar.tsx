import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut } from "../../providers/AuthContext";
import { useLanguage } from "../../hooks/useLanguage";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 selection:bg-brand-primary selection:text-brand-secondary ${
          isScrolled ? "glass-header py-3 shadow-lg" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 shadow-lg">
              <Briefcase className="w-6 h-6 text-brand-primary" />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-xl font-semibold text-brand-secondary tracking-tight leading-none group-hover:text-neutral-900 transition-colors">Trust Hire</span>
                <span className="text-[10px] font-medium text-brand-primary tracking-tight mt-0.5">India's Safest</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#benefits" className="text-brand-secondary/60 hover:text-brand-secondary font-medium transition-colors text-sm">
              {t('nav.benefits')}
            </a>
            <a href="#levels" className="text-brand-secondary/60 hover:text-brand-secondary font-medium transition-colors text-sm">
              {t('nav.levels')}
            </a>
            <a href="#how-it-works" className="text-brand-secondary/60 hover:text-brand-secondary font-medium transition-colors text-sm">
              {t('nav.how')}
            </a>
            
            <div className="w-px h-4 bg-brand-border mx-2" />

          <SignedOut>
            <Link to="/sign-in" className="text-brand-secondary/60 font-medium text-sm hover:text-brand-secondary transition-colors">
              {t('nav.login')}
            </Link>
            <Link
              to="/sign-up"
              className="px-6 py-3 bg-linear-to-r from-brand-secondary to-neutral-800 text-brand-primary rounded-xl font-semibold text-sm transition-all shadow-xl shadow-brand-secondary/20 active:scale-95"
            >
              {t('nav.getStarted')}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-brand-secondary hover:bg-neutral-800 text-brand-primary rounded-xl font-semibold text-sm transition-all shadow-xl shadow-brand-secondary/20 active:scale-95"
            >
              {t('nav.dashboard')}
            </Link>
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="text-brand-secondary p-2 bg-white/50 rounded-lg shadow-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-brand-bg border-b border-brand-border p-8 space-y-6 shadow-2xl overflow-hidden"
          >
          <a href="#benefits" className="block text-brand-secondary font-medium text-base" onClick={() => setMobileMenuOpen(false)}>{t('nav.benefits')}</a>
          <a href="#levels" className="block text-brand-secondary font-medium text-base" onClick={() => setMobileMenuOpen(false)}>{t('nav.levels')}</a>
          <a href="#how-it-works" className="block text-brand-secondary font-medium text-base" onClick={() => setMobileMenuOpen(false)}>{t('nav.how')}</a>
          <div className="h-px bg-brand-border" />
          <SignedOut>
            <Link to="/sign-in" className="block text-brand-secondary font-medium text-base" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
            <Link to="/sign-up" className="block w-full text-center py-5 bg-brand-secondary text-brand-primary rounded-2xl font-semibold shadow-xl" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.getStarted')}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="block w-full text-center py-5 bg-brand-secondary text-brand-primary rounded-2xl font-semibold shadow-xl" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.dashboard')}
            </Link>
          </SignedIn>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}
