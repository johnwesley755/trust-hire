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
    { name: "Mission", href: "#vision" },
    { name: "Enterprise", href: "#features" },
    { name: "Verification", href: "#network" },
    { name: "Fleet", href: "#how-it-works" },
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
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-bold text-brand-secondary/80 hover:text-brand-primary transition-colors tracking-tight"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {user ? (
            <Link
              to="/dashboard"
              className="px-8 py-3.5 bg-brand-secondary text-brand-primary rounded-xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-black text-brand-secondary hover:text-brand-primary transition-colors tracking-tight"
              >
                Partner Login
              </Link>
              <Link
                to="/sign-up"
                className="px-8 py-3.5 bg-brand-secondary text-brand-primary rounded-xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </>
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
              to="/login"
              className="text-lg font-black text-brand-text"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/sign-up"
              className="w-full py-4 bg-brand-secondary text-brand-primary rounded-xl font-black text-center shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
