import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-header py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-teal rounded-xl flex items-center justify-center">
              <span className="text-brand-amber font-black text-lg leading-none">T</span>
            </div>
            <span className="text-xl font-black text-[#111] tracking-tight">
              Trust<span className="text-brand-teal">Hire</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-[#111] hover:text-brand-teal font-semibold transition-colors text-sm">
              {t('nav.benefits')}
            </a>
            <a href="#levels" className="text-[#111] hover:text-brand-teal font-semibold transition-colors text-sm">
              {t('nav.levels')}
            </a>
            <a href="#how-it-works" className="text-[#111] hover:text-brand-teal font-semibold transition-colors text-sm">
              {t('nav.how')}
            </a>
            

          <SignedOut>
            <Link to="/sign-in" className="text-[#111] font-bold text-sm hover:text-brand-teal transition-colors">
              {t('nav.login')}
            </Link>
            <Link
              to="/sign-up"
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-light text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {t('nav.getStarted')}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-light text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {t('nav.dashboard')}
            </Link>
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="text-[#111] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-brand-cream border-b border-black/10 p-6 space-y-4 shadow-xl"
          >
          <a href="#benefits" className="block text-[#111] font-semibold">{t('nav.benefits')}</a>
          <a href="#levels" className="block text-[#111] font-semibold">{t('nav.levels')}</a>
          <a href="#how-it-works" className="block text-[#111] font-semibold">{t('nav.how')}</a>
          <SignedOut>
            <Link to="/sign-in" className="block text-[#111] font-bold">{t('nav.login')}</Link>
            <Link to="/sign-up" className="block w-full text-center py-3 bg-brand-teal text-white rounded-xl font-bold">
              {t('nav.getStarted')}
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="block w-full text-center py-3 bg-brand-teal text-white rounded-xl font-bold">
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
