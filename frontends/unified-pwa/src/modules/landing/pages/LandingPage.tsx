import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Briefcase, 
  UserCheck, 
  Building2, 
  LayoutDashboard,
  Check,
  X,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles
} from "lucide-react";

import { LANDING_IMAGES } from "../constants/landingAssets";

// Trust Carousel Slide Data (Sourced from LANDING_IMAGES.specialists)
const TRUST_SLIDES = LANDING_IMAGES.specialists;

// Hero Collections Slider Data - High Demand Core Sectors
const HERO_COLLECTIONS = [
  {
    image: LANDING_IMAGES.culinary.src,
    brand: "TrustHyre Culinary",
    title: "Chefs & Kitchen Crews",
    cta: "Hire culinary staff",
    alt: LANDING_IMAGES.culinary.alt,
  },
  {
    image: LANDING_IMAGES.electrician.src,
    brand: "TrustHyre Power",
    title: "Certified Electricians",
    cta: "Hire specialists",
    alt: LANDING_IMAGES.electrician.alt,
  },
  {
    image: LANDING_IMAGES.warehouseLogistics.src,
    brand: "Fleet Logistics",
    title: "Warehouse & Supply",
    cta: "Deploy crew",
    alt: LANDING_IMAGES.warehouseLogistics.alt,
  },
  {
    image: LANDING_IMAGES.plumbing.src,
    brand: "Commercial Trades",
    title: "Plumbers & Pipefitters",
    cta: "Browse trades",
    alt: LANDING_IMAGES.plumbing.alt,
  },
];

// Numbered Primary Workforce Sectors (All TrustHyre Core Domains)
const WORKFORCE_TRACKS = [
  {
    index: "01",
    name: "Commercial Culinary & Hospitality",
    description: "Executive chefs, line cooks, kitchen supervisors, and banquet crews for restaurants, hotels, and cloud kitchens.",
    href: "/sign-up?role=employer",
  },
  {
    index: "02",
    name: "Electrical Systems & Industrial Wiring",
    description: "Licensed electricians, panel assemblers, high-voltage technicians, and maintenance wiremen.",
    href: "/sign-up?role=employer",
  },
  {
    index: "03",
    name: "Warehouse Logistics, Fulfillment & Fleet",
    description: "Certified forklift drivers, inventory controllers, packaging staff, and route delivery personnel.",
    href: "/sign-up?role=employer",
  },
  {
    index: "04",
    name: "Commercial Plumbing & Pipefitting",
    description: "Licensed plumbers, drainage specialists, pipeline welders, and water infrastructure technicians.",
    href: "/sign-up?role=employer",
  },
  {
    index: "05",
    name: "Carpentry, Masonry & Construction",
    description: "Skilled carpenters, structural masons, drywall finish crews, and civil infrastructure specialists.",
    href: "/sign-up?role=employer",
  },
  {
    index: "06",
    name: "Facility Security & Site Protection",
    description: "Licensed security personnel, access controllers, perimeter monitors, and verified safety officers.",
    href: "/sign-up?role=employer",
  },
  {
    index: "07",
    name: "Commercial Cleaning & Sanitation",
    description: "Industrial deep-cleaning crews, food-grade facility sanitation, and corporate housekeeping.",
    href: "/sign-up?role=employer",
  },
];

// Hero Dual-Role & Common Showcase Modes
const HERO_MODES = [
  {
    role: "COMMON",
    modeLabel: "Platform Overview",
    titleWords: ["CONNECT", "&", "WORK"],
    tagline: ["ZERO BROKERS,", "DIRECT JOBS."],
    badge: "Open Workforce Application",
  },
  {
    role: "WORKER",
    modeLabel: "For Candidates",
    titleWords: ["FIND", "LOCAL", "JOBS"],
    tagline: ["SHOW UP,", "GET PAID."],
    badge: "Candidate: Verified Daily Escrow Payouts",
  },
  {
    role: "EMPLOYER",
    modeLabel: "For Employers",
    titleWords: ["HIRE", "SKILLED", "TALENT"],
    tagline: ["VERIFIED,", "ON DEMAND."],
    badge: "Employer: Direct Hiring & Zero Brokerage",
  },
];

// Testimonials & Project Personas Data
const TESTIMONIALS = [
  {
    quote: "Finding verified electrical maintenance jobs nearby without losing 20% to brokers changed everything. My wages are secured in escrow before I even reach the site.",
    author: "Rahul S.",
    role: "Licensed Electrician · Candidate Persona",
  },
  {
    quote: "When we need kitchen staff for weekend rushes, I can review verified candidate profiles and know attendance is face-matched live at check-in.",
    author: "Kavitha R.",
    role: "Cafe & Cloud Kitchen Operator · Employer Persona",
  },
  {
    quote: "TrustHyre was built to solve payment disputes and unreliable check-ins through biometric geofencing and automated escrow smart-holds.",
    author: "TrustHyre Architecture",
    role: "Open Workforce System Showcase",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useAuth();
  const [ready, setReady] = useState(false);
  const [loaderExited, setLoaderExited] = useState(false);

  // Overlays
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hero Mode Switcher (Rotates every 5.5s or via role pills)
  const [heroModeIdx, setHeroModeIdx] = useState(0);

  useEffect(() => {
    const modeTimer = setInterval(() => {
      setHeroModeIdx((prev) => (prev + 1) % HERO_MODES.length);
    }, 5500);
    return () => clearInterval(modeTimer);
  }, []);

  // Carousels State
  const [activeTrustSlide, setActiveTrustSlide] = useState(0);
  const [trustGhostKey, setTrustGhostKey] = useState(0);
  const [activeHeroCollection, setActiveHeroCollection] = useState(0);

  // Hero Multi-Sector Background Transition
  const [activeHeroBgIdx, setActiveHeroBgIdx] = useState(0);

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setActiveHeroBgIdx((prev) => (prev + 1) % LANDING_IMAGES.heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(bgTimer);
  }, []);

  // Parallax Values
  const [heroParallax, setHeroParallax] = useState(0);
  const [ghostParallax, setGhostParallax] = useState(0);

  const lenisRef = useRef<Lenis | null>(null);
  const trustSectionRef = useRef<HTMLElement | null>(null);

  const isEmployer = user?.role === "EMPLOYER";
  const isAdmin = user?.role === "ADMIN";
  const isCandidate = user?.role === "WORKER";

  // --------------------------------------------------------------------------
  // 1. Lenis Smooth Scroll Setup + Adaptive Scaling
  // --------------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Start with scroll locked for intro loader
    lenis.stop();

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Track scroll for parallax effects
    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      
      // Hero parallax: 0% -> 12%
      const heroP = Math.min(Math.max(scrollY / vh, 0), 1);
      setHeroParallax(heroP * 12);

      // Ghost words parallax in Trust section
      if (trustSectionRef.current) {
        const rect = trustSectionRef.current.getBoundingClientRect();
        const sectionProgress = (vh - rect.top) / (vh + rect.height);
        const clampedProgress = Math.min(Math.max(sectionProgress, 0), 1);
        setGhostParallax((clampedProgress - 0.5) * 6); // -3% to +3%
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Adaptive Rem Scaling for ultra-wide screens (width > 1920)
    const handleResize = () => {
      const FONT_BASE = 16, BASE_W = 1920, COEF = 0.6666;
      const innerW = window.innerWidth;
      const reduction = ((BASE_W - innerW) / BASE_W) * 100 * COEF;
      const size = FONT_BASE - (FONT_BASE * reduction) / 100;
      if (size > FONT_BASE) {
        document.documentElement.style.fontSize = size + "px";
      } else {
        document.documentElement.style.removeProperty("font-size");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
    };
  }, []);

  // --------------------------------------------------------------------------
  // 2. Intro Curtain Loader Timing
  // --------------------------------------------------------------------------
  useEffect(() => {
    const MIN_VISIBLE = 1400;
    const EXIT_MS = 850;

    const timer = setTimeout(() => {
      setReady(true);
      if (lenisRef.current) {
        lenisRef.current.start();
      }
      setTimeout(() => {
        setLoaderExited(true);
      }, EXIT_MS);
    }, MIN_VISIBLE);

    return () => clearTimeout(timer);
  }, []);

  // --------------------------------------------------------------------------
  // 3. Hero Collection Slider Autoplay (3800ms)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      setActiveHeroCollection((prev) => (prev + 1) % HERO_COLLECTIONS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [ready]);

  // --------------------------------------------------------------------------
  // 4. Scroll Lock for Fullscreen Menu
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (lenisRef.current) {
      if (isMenuOpen) {
        lenisRef.current.stop();
        document.documentElement.style.overflow = "hidden";
      } else if (ready) {
        lenisRef.current.start();
        document.documentElement.style.removeProperty("overflow");
      }
    }
  }, [isMenuOpen, ready]);

  // Handle ESC key for fullscreen menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cycle Trust Slides
  const handleTrustPrev = () => {
    setActiveTrustSlide((prev) => (prev === 0 ? TRUST_SLIDES.length - 1 : prev - 1));
    setTrustGhostKey((k) => k + 1);
  };
  const handleTrustNext = () => {
    setActiveTrustSlide((prev) => (prev + 1) % TRUST_SLIDES.length);
    setTrustGhostKey((k) => k + 1);
  };
  const handleTrustDot = (idx: number) => {
    setActiveTrustSlide(idx);
    setTrustGhostKey((k) => k + 1);
  };

  const currentSlide = TRUST_SLIDES[activeTrustSlide];

  return (
    <div className="baseline-root bg-white text-[#0a0a0a] min-h-screen selection:bg-[#2563c9] selection:text-white font-['Onest',system-ui,sans-serif]">
      
      {/* ===================================================================== */}
      {/* 0. INTRO CURTAIN LOADER */}
      {/* ===================================================================== */}
      {!loaderExited && (
        <div 
          className={`fixed inset-0 z-[200] bg-[#0f2f63] text-white flex flex-col items-center justify-center transition-transform duration-[850ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
            ready ? "-translate-y-[105%]" : "translate-y-0"
          }`}
        >
          {/* Brand Wordmark with initial fade/rise */}
          <div className="flex items-center gap-3.5 mb-8 animate-[fadeRise_600ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="w-8 h-8 rounded-full border-[2.2px] border-white flex items-center justify-center p-1.5">
              <ShieldCheck className="w-full h-full text-white" />
            </div>
            <span className="text-2xl font-medium tracking-[0.22em] uppercase">TrustHyre</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-40 h-[1.5px] rounded-full bg-white/20 overflow-hidden relative">
            <div 
              className="absolute inset-y-0 left-0 bg-white origin-left transition-transform duration-[1280ms] ease-[cubic-bezier(0.65,0,0.35,1)] delay-100"
              style={{ transform: ready ? "scaleX(1)" : "scaleX(0.08)", width: "100%" }}
            />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FULLSCREEN MENU OVERLAY */}
      {/* ===================================================================== */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col pointer-events-auto">
          {/* Navy Backdrop */}
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-[#0f2f63] opacity-98 transition-opacity duration-300"
          />

          {/* Inner Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-10 text-white">
            {/* Top Row: Brand & Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-medium tracking-[0.2em] uppercase">TrustHyre</span>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-transform hover:rotate-90 group cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-white transition-transform duration-200" />
              </button>
            </div>

            {/* Center Navigation Links */}
            <nav className="flex flex-col gap-2 my-auto">
              {[
                { label: "Categories", href: "#categories" },
                { label: "Technology", href: "#technology" },
                { label: "Metrics", href: "#metrics" },
                { label: "Reviews", href: "#reviews" },
                { label: "Contact", href: "#contact" },
              ].map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${120 + idx * 70}ms` }}
                  className="text-5xl sm:text-7xl font-medium tracking-tight text-white hover:text-[#5790e6] transition-colors leading-[1.05] block py-1"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Bottom Row */}
            <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                to="/find-workers"
                onClick={() => setIsMenuOpen(false)}
                className="px-7 py-3.5 rounded-full bg-white text-[#0f2f63] font-medium text-sm tracking-wide uppercase hover:bg-[#5790e6] hover:text-white transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Candidates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-6 text-sm text-white/70">
                <Link to="/sign-in?role=worker" className="hover:text-white transition-colors">Candidate Login</Link>
                <Link to="/sign-in?role=employer" className="hover:text-white transition-colors">Employer Login</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN CONTENT WRAPPER WITH INSET PAGE FRAME (p-2 sm:p-3) */}
      {/* ===================================================================== */}
      <main className="w-full p-2 sm:p-3 overflow-x-clip bg-white">
        
        {/* =================================================================== */}
        {/* 1. HERO SECTION */}
        {/* =================================================================== */}
        <section className="relative isolate overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#0f2f63] text-white min-h-[38rem] h-auto lg:h-[calc(100svh-1.5rem)] flex flex-col justify-between">
          
          {/* Parallax Background Plate with Multi-Sector Crossfade Transitions */}
          <div 
            className="absolute inset-x-0 -top-[16%] h-[132%] w-full -z-10 pointer-events-none transition-transform duration-75 ease-out overflow-hidden"
            style={{ transform: `translateY(${heroParallax}%)` }}
          >
            {LANDING_IMAGES.heroBackgrounds.map((bg, idx) => (
              <img 
                key={bg.src}
                src={bg.src}
                alt={bg.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  idx === activeHeroBgIdx ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            ))}
            {/* Top-to-bottom Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f2f63]/80 via-[#0f2f63]/50 to-[#0f2f63]/85" />
          </div>

          {/* SITE HEADER (Transparent inside Hero) */}
          <header className="w-full px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-between text-xs z-20">
            {/* Left Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              <a href="#categories" className="text-white/85 hover:text-white transition-colors tracking-wide">
                Categories & Talent
              </a>
              <a href="#technology" className="text-white/85 hover:text-white transition-colors tracking-wide">
                Trust & Verification
              </a>
              <a href="#metrics" className="text-white/85 hover:text-white transition-colors tracking-wide">
                By The Numbers
              </a>
            </nav>

            {/* Center Brand */}
            <div className="flex items-center justify-center gap-2 flex-1 lg:justify-center">
              <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center p-1">
                <ShieldCheck className="w-full h-full text-white" />
              </div>
              <span className="text-base font-medium tracking-[0.2em] uppercase text-white">TrustHyre</span>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center justify-end gap-4 flex-1">
              {isSignedIn ? (
                <div className="hidden sm:flex items-center gap-2">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#0f2f63] hover:bg-[#5790e6] hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Hub</span>
                    </Link>
                  ) : isEmployer ? (
                    <>
                      <Link
                        to="/find-workers"
                        className="px-3.5 py-2 rounded-full text-xs font-medium text-white/90 hover:text-white transition-colors"
                      >
                        Find Candidates
                      </Link>
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#0f2f63] hover:bg-[#5790e6] hover:text-white transition-colors"
                      >
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/search"
                        className="px-3.5 py-2 rounded-full text-xs font-medium text-white/90 hover:text-white transition-colors"
                      >
                        Find Jobs
                      </Link>
                      <Link
                        to="/applied-jobs"
                        className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#0f2f63] hover:bg-[#5790e6] hover:text-white transition-colors"
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/sign-in?role=worker"
                    className="hidden md:inline-flex text-white/80 hover:text-white uppercase tracking-wider text-xs transition-colors"
                  >
                    Worker Login
                  </Link>
                  <Link
                    to="/sign-in?role=employer"
                    className="hidden sm:inline-flex text-white/80 hover:text-white uppercase tracking-wider text-xs transition-colors"
                  >
                    Employer Login
                  </Link>
                  <Link
                    to="/find-workers"
                    className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Explore Workers
                  </Link>
                </>
              )}

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-xs hover:bg-white/25 flex flex-col items-center justify-center gap-1.25 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <span className="w-4 h-[1px] bg-white block" />
                <span className="w-4 h-[1px] bg-white block" />
              </button>
            </div>
          </header>

          {/* DYNAMIC TITLE BLOCK FOR BOTH CANDIDATES & EMPLOYERS */}
          <div className="px-6 sm:px-10 pt-4 sm:pt-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.8rem] font-medium uppercase leading-[0.92] tracking-tight text-white max-w-5xl">
              {HERO_MODES[heroModeIdx].titleWords.map((word, wIdx) => (
                <span 
                  key={`${heroModeIdx}-${word}`} 
                  className="inline-block overflow-hidden pb-[0.08em] mr-[0.25em] last:mr-0 align-bottom"
                >
                  <span 
                    className={`inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      ready ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                    }`}
                    style={{ transitionDelay: `${wIdx * 120}ms` }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            {/* Direct Dual Call To Action Row (No Sales Consultation) */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/search"
                className="px-5 py-2.5 rounded-full bg-white text-[#0f2f63] font-medium text-xs uppercase hover:bg-[#5790e6] hover:text-white transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/find-workers"
                className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-medium text-xs uppercase hover:bg-white/25 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Hire Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* BOTTOM ROW (Tagline + Floating Cluster) */}
          <div className="mt-auto px-6 pb-8 sm:px-10 sm:pb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            
            {/* Tagline Stacked Lines + Active Sector Indicator */}
            <div className="space-y-3">
              <div className="space-y-1">
                {HERO_MODES[heroModeIdx].tagline.map((line, lIdx) => (
                  <div key={`${heroModeIdx}-${line}`} className="overflow-hidden pb-[0.14em]">
                    <p 
                      className={`text-3xl sm:text-[2.4rem] font-medium uppercase leading-[0.95] tracking-tight text-white/85 transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        ready ? "translate-y-0 opacity-100" : "translate-y-[115%] opacity-0"
                      }`}
                      style={{ transitionDelay: `${250 + lIdx * 100}ms` }}
                    >
                      {line}
                    </p>
                  </div>
                ))}
              </div>

              {/* Active Sector Crossfade Indicator Pill */}
              <div 
                className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[0.7rem] text-white/90 transition-all duration-500 ${
                  ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5790e6] animate-pulse" />
                <span className="font-medium uppercase tracking-wider">{HERO_MODES[heroModeIdx].badge}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/70">{LANDING_IMAGES.heroBackgrounds[activeHeroBgIdx].label}</span>
                <div className="flex items-center gap-1 ml-1">
                  {LANDING_IMAGES.heroBackgrounds.map((_, dotIdx) => (
                    <span 
                      key={dotIdx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        dotIdx === activeHeroBgIdx ? "w-3 bg-white" : "w-1 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Cluster */}
            <div className="flex items-end gap-4 w-full sm:w-auto">
              
              {/* Collection Slider (3800ms Auto-advance Card) */}
              <div 
                className={`hidden md:flex flex-col gap-2.5 w-64 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-[650ms] ${
                  ready ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
                }`}
              >
                <div className="rounded-[1.5rem] border border-white/15 bg-white/10 backdrop-blur-md p-3 shadow-xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={HERO_COLLECTIONS[activeHeroCollection].image}
                      alt={HERO_COLLECTIONS[activeHeroCollection].alt}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[0.7rem] font-medium uppercase tracking-wider text-white">
                      {HERO_COLLECTIONS[activeHeroCollection].brand}
                    </span>
                    <span className="text-[0.7rem] uppercase text-white/80 truncate">
                      {HERO_COLLECTIONS[activeHeroCollection].title}
                    </span>
                    <Link 
                      to="/sign-up?role=employer" 
                      className="text-[0.65rem] underline text-[#5790e6] hover:text-white mt-1 transition-colors"
                    >
                      {HERO_COLLECTIONS[activeHeroCollection].cta} →
                    </Link>
                  </div>
                </div>

                {/* Slider Dots */}
                <div className="flex items-center gap-1.5 px-2">
                  {HERO_COLLECTIONS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveHeroCollection(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeHeroCollection === dotIdx ? "w-5 bg-white" : "w-1.5 bg-white/40"
                      }`}
                      aria-label={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>


            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. TRUST SECTION ("TRUSTED BY SERIOUS BUSINESSES") */}
        {/* =================================================================== */}
        <section 
          ref={trustSectionRef}
          className="relative isolate overflow-hidden bg-white px-6 py-8 sm:px-10 sm:py-12 text-[#0a0a0a]"
        >
          {/* Top Badges Row - Tight Spacing */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6 sm:mb-8">
            
            {/* 100% Circle Badge */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f4f4f4] flex flex-col items-center justify-center p-3 text-center shrink-0 shadow-xs">
              <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">100%</span>
              <span className="text-[0.55rem] text-[#717784] max-w-[8em] leading-tight mt-1 uppercase tracking-wider">
                Escrow backed & payout insured
              </span>
            </div>

            {/* Badge Card */}
            <article className="max-w-md bg-[#f4f4f4] rounded-[1.5rem] p-4 sm:p-5 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-white px-3 py-1 text-xs font-medium text-[#0a0a0a] shadow-xs">
                  #01
                </span>
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] tracking-tight">
                  Direct Workforce Platform
                </h3>
              </div>
              <p className="text-xs text-[#717784] leading-relaxed">
                Designed to serve culinary kitchens, electrical maintenance, logistics, and skilled trades. Biometric attendance and automated digital escrow keep daily work transparent and fraud-free.
              </p>
            </article>
          </div>

          {/* OVERSIZED GHOST HEADINGS (2 ROWS OF 2 WORDS) */}
          <div className="relative max-w-6xl mx-auto my-1 pointer-events-none select-none z-0">
            <h2 key={trustGhostKey} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium uppercase leading-[0.98] tracking-tight text-center">
              
              {/* Row 1: Word 1 & Word 2 */}
              <div 
                className="flex justify-between items-center transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${ghostParallax}%)` }}
              >
                <span className="overflow-hidden inline-block pb-[0.08em]">
                  <span className="inline-block text-[#d7dae1] animate-[ghostSlideUp_700ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {currentSlide.headline[0]}
                  </span>
                </span>
                <span className="overflow-hidden inline-block pb-[0.08em]">
                  <span className="inline-block text-[#d7dae1] animate-[ghostSlideUp_700ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {currentSlide.headline[1]}
                  </span>
                </span>
              </div>

              {/* Row 2: Word 3 (Ink) & Word 4 (Ghost) */}
              <div 
                className="flex justify-between items-center transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${-ghostParallax}%)` }}
              >
                <span className="overflow-hidden inline-block pb-[0.08em]">
                  <span className="inline-block text-[#0a0a0a] animate-[ghostSlideUp_700ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {currentSlide.headline[2]}
                  </span>
                </span>
                <span className="overflow-hidden inline-block pb-[0.08em]">
                  <span className="inline-block text-[#d7dae1] animate-[ghostSlideUp_700ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {currentSlide.headline[3]}
                  </span>
                </span>
              </div>

            </h2>
          </div>

          {/* CENTER SPECIALIST CARD - Overlapping editorial poster */}
          <div className="relative z-10 mx-auto -mt-8 sm:-mt-12 md:-mt-18 w-48 sm:w-56 pointer-events-auto">
            <figure className="relative aspect-[3/4] rounded-[1.5rem] bg-[#2563c9] overflow-hidden rotate-6 shadow-2xl transition-transform duration-500 hover:rotate-3">
              <img 
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.alt}
                className="w-full h-full object-cover animate-[fadeIn_400ms_ease-out_forwards]"
              />
              {/* Glass Caption */}
              <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-[#0f2f63]/60 backdrop-blur-md p-2.5 text-white text-left shadow-lg">
                <p className="text-xs sm:text-sm font-medium tracking-tight truncate">{currentSlide.name}</p>
                <p className="text-[0.6rem] text-white/80 uppercase tracking-wide mt-0.5 truncate">{currentSlide.role}</p>
              </figcaption>
            </figure>
          </div>

          {/* CAROUSEL CONTROLS ROW - Tightly spaced */}
          <div className="relative z-20 mt-6 sm:mt-8 flex items-center justify-between">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handleTrustPrev}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#e6e8ec] hover:border-[#0a0a0a] text-[#0a0a0a] flex items-center justify-center transition-colors cursor-pointer group"
              aria-label="Previous slide"
            >
              <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:scale-115" />
            </button>

            {/* Carousel Dots */}
            <div className="flex items-center gap-2">
              {TRUST_SLIDES.map((_, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleTrustDot(sIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTrustSlide === sIdx ? "w-6 bg-[#0a0a0a]" : "w-1.5 bg-[#d7dae1]"
                  }`}
                  aria-label={`Slide ${sIdx + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleTrustNext}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0a0a0a] hover:bg-[#0f2f63] text-white flex items-center justify-center transition-colors cursor-pointer group"
              aria-label="Next slide"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:scale-115" />
            </button>
          </div>

        </section>

        {/* =================================================================== */}
        {/* 3. PROGRAMS / WORKFORCE TRACKS SECTION (Tight Spacing) */}
        {/* =================================================================== */}
        <section id="categories" className="bg-[#f4f4f4] py-12 sm:py-16 px-6 sm:px-10 text-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#717784] mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
                <span>Enterprise Sectors</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.96]">
                Every industry <br /> on demand
              </h2>
            </div>

            {/* Core Sector Rows (Tighter Spacing) */}
            <ul className="mt-8 divide-y divide-[#e6e8ec] border-y border-[#e6e8ec]">
              {WORKFORCE_TRACKS.map((track) => (
                <li key={track.index}>
                  <Link
                    to={track.href}
                    className="group py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-colors hover:bg-white/70 px-3 sm:px-4 rounded-xl cursor-pointer"
                  >
                    <div className="flex items-baseline sm:items-center gap-4 sm:gap-6 flex-1">
                      <span className="w-8 sm:w-10 text-xs sm:text-sm font-medium text-[#717784]">
                        {track.index}
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 flex-1">
                        <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a] min-w-[16rem]">
                          {track.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#717784] max-w-lg">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    {/* Trailing Arrow Circle (Spring on Hover) */}
                    <div className="w-9 h-9 rounded-full border border-[#e6e8ec] flex items-center justify-center shrink-0 self-end sm:self-center group-hover:border-[#0a0a0a] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-[#0a0a0a] opacity-55 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. FACILITIES / VERIFICATION TECH SECTION (-mt-6 Overlap) */}
        {/* =================================================================== */}
        <section 
          id="technology" 
          className="relative z-10 -mt-6 sm:-mt-8 rounded-[2rem] bg-white pt-10 pb-12 px-6 sm:px-10 text-[#0a0a0a] shadow-sm"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            
            {/* Intro Column */}
            <div className="max-w-md">
              <div className="w-14 h-14 rounded-[1.25rem] overflow-hidden mb-4 shadow-sm">
                <img 
                  src={LANDING_IMAGES.siteInspectorThumbnail.src} 
                  alt={LANDING_IMAGES.siteInspectorThumbnail.alt}
                  className="w-full h-full object-cover" 
                />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.96]">
                Biometric & Escrow <br /> Verification Tech
              </h2>

              <p className="text-xs sm:text-sm text-[#717784] mt-4 leading-relaxed max-w-sm">
                Every technician is identity-checked and face-matched on site via geofenced attendance coordinates, with wages guaranteed through automated escrow security.
              </p>
            </div>

            {/* Staggered Verification Cards */}
            <div className="flex items-end gap-4">
              
              {/* Tile 1: Biometric Verification */}
              <figure className="flex-1 aspect-[3/4] rounded-[1.5rem] overflow-hidden relative bg-[#f4f4f4] group shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src={LANDING_IMAGES.biometricGeofence.src} 
                  alt={LANDING_IMAGES.biometricGeofence.alt}
                  className="w-full h-full object-cover"
                />
                <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-[#0f2f63]/60 backdrop-blur-md p-2.5 text-white text-left shadow-lg">
                  <p className="text-xs sm:text-sm font-medium tracking-tight">Biometric Geofence</p>
                  <p className="text-[0.6rem] text-white/85 leading-snug mt-0.5">
                    Face-verified punch-in ensures 100% genuine on-site attendance.
                  </p>
                </figcaption>
              </figure>

              {/* Tile 2: Smart Escrow Vault (Staggered mb-6) */}
              <figure className="flex-1 aspect-[3/4] rounded-[1.5rem] overflow-hidden relative bg-[#f4f4f4] mb-6 group shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src={LANDING_IMAGES.digitalEscrowVault.src} 
                  alt={LANDING_IMAGES.digitalEscrowVault.alt}
                  className="w-full h-full object-cover"
                />
                <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-[#0b6e97]/60 backdrop-blur-md p-2.5 text-white text-left shadow-lg">
                  <p className="text-xs sm:text-sm font-medium tracking-tight">Digital Escrow Vault</p>
                  <p className="text-[0.6rem] text-white/85 leading-snug mt-0.5">
                    Automated payouts release directly to UPI once work is approved.
                  </p>
                </figcaption>
              </figure>

            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. STATS SECTION (Deep Navy Band - Tight Spacing) */}
        {/* =================================================================== */}
        <section 
          id="metrics" 
          className="mt-3 rounded-[2rem] bg-[#0f2f63] text-white py-12 sm:py-14 px-6 sm:px-10"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/70 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5790e6]" />
                <span>Enterprise Scale</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-[0.96]">
                A platform that <br /> keeps score
              </h2>
            </div>

            {/* 4-Up Metrics Grid */}
            <dl className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {[
                { value: "100%", label: "Escrow Wage Protection", desc: "Automated funds lock on booking, released on verified completion" },
                { value: "GPS + Face", label: "Geofenced Check-In", desc: "Real-time biometric attendance verified within site radius" },
                { value: "0%", label: "Agency Brokerage", desc: "Direct worker-to-employer connection with honest transparent wages" },
                { value: "Instant", label: "UPI Payout Settlement", desc: "Direct UPI wage transfer without payroll paperwork friction" },
              ].map((stat, idx) => (
                <div key={idx} className="border-t border-white/20 pt-4 text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <div className="text-3xl sm:text-4xl font-medium tracking-tight text-white leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white/90 mt-2 leading-snug">
                      {stat.label}
                    </div>
                    <div className="text-[11px] text-white/60 mt-1 leading-snug">
                      {stat.desc}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 6. TESTIMONIALS SECTION (Tight Spacing) */}
        {/* =================================================================== */}
        <section id="reviews" className="py-10 sm:py-14 px-6 sm:px-10 bg-white text-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#717784] mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
                <span>Enterprise Feedback</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.96]">
                Loved by operations <br /> teams & managers
              </h2>
            </div>

            {/* 3-Up Cards */}
            <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, idx) => (
                <li key={idx}>
                  <div className="flex flex-col justify-between h-full rounded-[1.5rem] bg-[#f4f4f4] p-6 transition-transform duration-300 hover:-translate-y-1.5 shadow-xs">
                    <span className="text-3xl font-serif text-[#2563c9] leading-none">
                      “
                    </span>
                    <blockquote className="text-sm sm:text-base text-[#0a0a0a] leading-relaxed my-3">
                      {t.quote}
                    </blockquote>
                    <figcaption className="border-t border-[#e6e8ec] pt-3 text-left">
                      <p className="font-medium text-sm text-[#0a0a0a]">{t.author}</p>
                      <p className="text-xs text-[#717784] mt-0.5">{t.role}</p>
                    </figcaption>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 7. FOOTER SECTION (Deep Navy Corporate) */}
        {/* =================================================================== */}
        <footer id="contact" className="mt-3 rounded-[2rem] bg-[#0f2f63] text-white py-10 sm:py-12 px-6 sm:px-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Top CTA Band */}
            <div className="border-b border-white/15 pb-8 sm:pb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/70 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5790e6]" />
                </div>
                <h3 className="text-4xl sm:text-5xl font-medium tracking-tight text-white leading-[0.94]">
                  Explore the TrustHyre <br /> application
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/search"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#0f2f63] font-medium text-xs uppercase hover:bg-[#5790e6] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/find-workers"
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/30 text-white font-medium text-xs uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Candidates</span>
                </Link>
              </div>
            </div>

            {/* Columns Grid */}
            <div className="py-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-white/15 text-left">
              
              {/* Brand Column */}
              <div className="space-y-3 max-w-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full border border-white/60 flex items-center justify-center p-1">
                    <ShieldCheck className="w-full h-full text-white" />
                  </div>
                  <span className="text-base font-medium tracking-[0.18em] uppercase text-white">TrustHyre</span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  Decentralized on-demand workforce web application. Built to connect skilled workers with businesses through biometric geofenced attendance, PWA accessibility, and automated escrow wage settlements.
                </p>

                <div className="text-xs text-white/80 space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-white/60">
                    <Sparkles className="w-3.5 h-3.5 text-[#5790e6]" />
                    <span>Stack: React + Node.js + Lakebase Postgres</span>
                  </div>
                </div>
              </div>

              {/* Column: For Employers */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-3">
                  For Employers
                </h4>
                <ul className="space-y-2.5 text-xs text-white/80">
                  <li><Link to="/find-workers" className="hover:text-white transition-colors">Browse Verified Candidates</Link></li>
                  <li><Link to="/sign-up?role=employer" className="hover:text-white transition-colors">Post a New Job</Link></li>
                  <li><Link to="/sign-in?role=employer" className="hover:text-white transition-colors">Employer Portal Login</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Escrow Protection Terms</Link></li>
                </ul>
              </div>

              {/* Column: For Workers */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-3">
                  For Candidates
                </h4>
                <ul className="space-y-2.5 text-xs text-white/80">
                  <li><Link to="/search" className="hover:text-white transition-colors">Search Available Jobs</Link></li>
                  <li><Link to="/sign-up?role=worker" className="hover:text-white transition-colors">Register Candidate Profile</Link></li>
                  <li><Link to="/sign-in?role=worker" className="hover:text-white transition-colors">Candidate Portal Login</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Data Security</Link></li>
                </ul>
              </div>

              {/* Column: Platform & Governance */}
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-3">
                  Platform
                </h4>
                <ul className="space-y-2.5 text-xs text-white/80">
                  <li><a href="#categories" className="hover:text-white transition-colors">Supported Job Categories</a></li>
                  <li><a href="#technology" className="hover:text-white transition-colors">Biometric & Escrow Tech</a></li>
                  <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Gateway</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
              <p>© 2026 TrustHyre · Personal Portfolio & Workforce Architecture Project.</p>
              
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
              </div>
            </div>

          </div>
        </footer>

      </main>

      {/* Scoped CSS animations for custom spring-like clip reveals */}
      <style>{`
        @keyframes ghostSlideUp {
          from {
            transform: translateY(115%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeRise {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes modalSpring {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
