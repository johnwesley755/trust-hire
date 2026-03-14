import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../../providers/AuthContext";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Talent Vision", href: "#vision" },
    { name: "Features", href: "#features" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:bg-brand-primary transition-all duration-300">
            <ShieldCheck className="text-white group-hover:text-brand-secondary w-6 h-6 transition-colors" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black text-brand-text tracking-tighter">
              TrustHire
            </span>
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.15em] bg-brand-secondary px-1.5 py-0.5 rounded ml-0.5">
              Enterprise
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-black text-brand-secondary hover:text-brand-primary transition-all tracking-tight"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-brand-border mx-2" />

          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-brand-secondary hover:bg-brand-secondary/90 text-brand-primary rounded-xl font-black text-sm transition-all shadow-xl shadow-brand-secondary/10"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-10">
              <Link
                to="/sign-in"
                className="text-sm font-black text-brand-secondary hover:text-brand-primary transition-all tracking-tight"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-8 py-4 bg-brand-secondary text-brand-primary rounded-2xl font-black text-sm tracking-tight transition-all shadow-2xl hover:scale-105 active:scale-95 shadow-brand-secondary/20"
              >
                Start Hiring
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-brand-text p-2 bg-brand-surface rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 bg-white rounded-2xl border border-brand-border p-6 shadow-2xl mt-4 animate-fade-in-up">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-black text-brand-text"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-brand-border" />
            <Link
              to="/sign-in"
              className="text-lg font-black text-brand-text"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="w-full py-4 bg-brand-secondary text-brand-primary rounded-xl font-black text-center shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Start Hiring
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
