import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useAuth } from "../../providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Scouting", href: "#scouting" },
    { name: "Security", href: "#security" },
    { name: "Network", href: "#network" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      <nav
        className={`flex items-center justify-between px-6 py-4 md:px-12 transition-all duration-500 ${
          isScrolled 
            ? "glass-header shadow-lg" 
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <ShieldCheck className="text-brand-secondary w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-brand-secondary tracking-tight">
            TrustHire
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-brand-secondary/70 hover:text-brand-primary transition-colors tracking-tight"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-brand-primary text-brand-secondary rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-xs font-bold text-brand-secondary/80 hover:text-brand-primary transition-colors uppercase tracking-widest"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="px-6 py-2.5 bg-brand-primary text-brand-secondary rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-brand-secondary hover:text-white transition-all"
              >
                Try Free
              </Link>
            </>
          )}
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-brand-secondary p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full left-0 right-0 mt-4 p-6 bg-white border border-brand-border rounded-lg shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-bold text-brand-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="h-px bg-brand-border" />
                <Link
                  to="/login"
                  className="text-lg font-bold text-brand-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Partner Login
                </Link>
                <Link
                  to="/sign-up"
                  className="w-full py-3 bg-brand-primary text-brand-secondary rounded-xl font-bold text-center shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
