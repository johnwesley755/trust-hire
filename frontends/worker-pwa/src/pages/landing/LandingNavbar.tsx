import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut } from "../../providers/AuthContext";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-header py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#1d4744] rounded-xl flex items-center justify-center">
            <span className="text-[#f0b429] font-black text-lg leading-none">T</span>
          </div>
          <span className="text-xl font-black text-[#111] tracking-tight">
            Trust<span className="text-[#1d4744]">Hire</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#benefits" className="text-[#111] hover:text-[#1d4744] font-semibold transition-colors text-sm">
            Benefits
          </a>
          <a href="#levels" className="text-[#111] hover:text-[#1d4744] font-semibold transition-colors text-sm">
            Career Levels
          </a>
          <a href="#how-it-works" className="text-[#111] hover:text-[#1d4744] font-semibold transition-colors text-sm">
            How It Works
          </a>
          <div className="h-5 w-px bg-black/20 mx-1" />
          <SignedOut>
            <Link to="/sign-in" className="text-[#111] font-bold text-sm hover:text-[#1d4744] transition-colors">
              Log In
            </Link>
            <Link
              to="/sign-up"
              className="px-5 py-2.5 bg-[#1d4744] hover:bg-[#2a5f5b] text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started Now
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-[#1d4744] hover:bg-[#2a5f5b] text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              My Dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#111] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#f5f4ef] border-b border-black/10 p-6 space-y-4 shadow-xl"
          >
            <a href="#benefits" className="block text-[#111] font-semibold">Benefits</a>
            <a href="#levels" className="block text-[#111] font-semibold">Career Levels</a>
            <a href="#how-it-works" className="block text-[#111] font-semibold">How It Works</a>
            <SignedOut>
              <Link to="/sign-in" className="block text-[#111] font-bold">Log In</Link>
              <Link to="/sign-up" className="block w-full text-center py-3 bg-[#1d4744] text-white rounded-xl font-bold">
                Get Started Now
              </Link>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="block w-full text-center py-3 bg-[#1d4744] text-white rounded-xl font-bold">
                My Dashboard
              </Link>
            </SignedIn>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
