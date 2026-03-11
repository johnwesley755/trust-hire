import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";
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
        isScrolled ? "glass-header py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            TrustHire <span className="text-indigo-600">Employer</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            How it Works
          </a>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <SignedOut>
            <Link
              to="/sign-in"
              className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Join Network
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 space-y-4 shadow-xl animate-fade-in-up">
          <a href="#features" className="block text-slate-600 font-medium">
            Features
          </a>
          <a href="#how-it-works" className="block text-slate-600 font-medium">
            How it Works
          </a>
          <SignedOut>
            <Link to="/sign-in" className="block text-slate-900 font-semibold">
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold"
            >
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold"
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
