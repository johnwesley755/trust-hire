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
  Sparkles,
  Globe,
  ChevronDown
} from "lucide-react";

import { useTranslation, SUPPORTED_LANGUAGES } from "../../../providers/TranslationContext";
import { LANDING_IMAGES } from "../constants/landingAssets";
import trustHyreLogo from "../../../assets/TrustHyre Skills and Opportunities Logo.png";
import trustHyreLightLogo from "../../../assets/TrustHyre Logo with Skills Tagline.png";

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
    cta: "Hire crew",
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
    title: "CONNECT & WORK",
    titleWords: ["CONNECT", "&", "WORK"],
    tagline: ["ZERO BROKERS,", "DIRECT JOBS."],
    badge: "Open Workforce Platform",
  },
  {
    role: "WORKER",
    modeLabel: "For Workers",
    title: "FIND LOCAL JOBS",
    titleWords: ["FIND", "LOCAL", "JOBS"],
    tagline: ["SHOW UP,", "GET PAID."],
    badge: "Workers: Guaranteed Daily Safe Pay",
  },
  {
    role: "EMPLOYER",
    modeLabel: "For Employers",
    title: "HIRE SKILLED TALENT",
    titleWords: ["HIRE", "SKILLED", "TALENT"],
    tagline: ["VERIFIED,", "ON DEMAND."],
    badge: "Employers: Direct Hiring & Zero Middle-Men",
  },
];

// Core Operating Standards & Guarantees (Replacing Fake Statistics)
const OPERATING_STANDARDS = [
  { 
    number: "#01", 
    title: "Guaranteed Advance Pay Protection", 
    subtitle: "Zero Unpaid Labor",
    desc: "Employer booking funds are secured in advance before workers deploy. Wages are released immediately upon verified task completion." 
  },
  { 
    number: "#02", 
    title: "GPS & Photo Attendance", 
    subtitle: "Verified Physical Arrival",
    desc: "Workers check in on-site using GPS geofencing and live photo capture. Employers get verifiable proof of arrival, eliminating ghost workers." 
  },
  { 
    number: "#03", 
    title: "Direct UPI Settlement", 
    subtitle: "0% Brokerage Cut",
    desc: "Workers receive 100% of their earned wages directly into their UPI or bank accounts with zero middle-men contractor deductions." 
  },
  { 
    number: "#04", 
    title: "Digital Dispute Records", 
    subtitle: "Transparent Resolution",
    desc: "Every shift maintains a permanent digital paper trail of check-ins, agreed hourly rates, and work summaries for fast, neutral conflict resolution." 
  },
];

// Platform Commitments (Replacing Fake Testimonials)
const PLATFORM_COMMITMENTS = [
  {
    badge: "For Employers",
    badgeColor: "bg-[#0f2f63] text-white",
    title: "Verified Arrival & Skill Assurance",
    desc: "Know exactly who is coming to your job site before they arrive.",
    points: [
      "Government ID & skill badge verified before dispatch",
      "Geofenced check-in: payment only releases on physical arrival",
      "Prompt automatic replacement or refund if worker is absent"
    ]
  },
  {
    badge: "For Workers",
    badgeColor: "bg-[#2563c9] text-white",
    title: "Protected Wages & Zero Broker Cut",
    desc: "Get paid on time, every time, without paying middle-men commissions.",
    points: [
      "Job budget is securely deposited before you travel to site",
      "100% of agreed pay deposited directly to UPI or bank",
      "Build a permanent, verifiable work history and ratings profile"
    ]
  },
  {
    badge: "Mutual Safety",
    badgeColor: "bg-[#e6e8ec] text-[#0a0a0a]",
    title: "Transparent Digital Work Orders",
    desc: "Clear records prevent misunderstandings and resolve disputes quickly.",
    points: [
      "GPS timestamped logs provide clear evidence of hours worked",
      "In-app scope and rate confirmation protects both parties",
      "Dedicated platform support resolves variances within 24 hours"
    ]
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useAuth();
  const [ready, setReady] = useState(false);
  const [loaderExited, setLoaderExited] = useState(false);

  // Overlays & Language
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const FONT_BASE = 17, BASE_W = 1920, COEF = 0.6666;
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
        >          {/* Official TrustHyre White Logo on Deep-Navy Curtain */}
          <div className="mb-8 animate-[fadeRise_600ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <img 
              src={trustHyreLightLogo} 
              alt="TrustHyre" 
              className="h-14 sm:h-16 md:h-20 w-auto object-contain block select-none drop-shadow-2xl" 
            />
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
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-2.5 group"
                aria-label="TrustHyre Home"
              >
                <img 
                  src={trustHyreLightLogo} 
                  alt="TrustHyre" 
                  className="h-10 sm:h-12 w-auto object-contain block select-none drop-shadow-md group-hover:scale-105 transition-transform" 
                />
              </Link>

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
                { label: "Standards", href: "#standards" },
                { label: "Protections", href: "#commitments" },
                { label: "Contact", href: "#contact" },
              ].map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${120 + idx * 70}ms` }}
                  className="text-5xl sm:text-7xl font-medium tracking-tight text-white hover:text-[#5790e6] transition-colors leading-[1.05] block py-1"
                >
                  {t(item.label, item.label)}
                </a>
              ))}
            </nav>

            {/* Language Switcher Bar in Fullscreen Menu */}
            <div className="py-4 border-t border-white/15 flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/60 font-semibold uppercase tracking-wider flex items-center gap-1.5 mr-2">
                <Globe className="w-3.5 h-3.5 text-white/70" />
                Language / மொழி / भाषा:
              </span>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    language === lang.code
                      ? "bg-white text-[#0f2f63] shadow-xs"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-[10px] opacity-70 ml-1">({lang.name})</span>
                </button>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                to="/find-workers"
                onClick={() => setIsMenuOpen(false)}
                className="px-7 py-3.5 rounded-full bg-white text-[#0f2f63] font-medium text-sm tracking-wide uppercase hover:bg-[#5790e6] hover:text-white transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t("Explore Candidates", "Explore Candidates")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-6 text-sm text-white/70">
                <Link to="/sign-in?role=worker" className="hover:text-white transition-colors">{t("Candidate Login", "Candidate Login")}</Link>
                <Link to="/sign-in?role=employer" className="hover:text-white transition-colors">{t("Employer Login", "Employer Login")}</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">{t("Privacy", "Privacy")}</Link>
                <Link to="/terms" className="hover:text-white transition-colors">{t("Terms", "Terms")}</Link>
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
              <a href="#categories" className="text-white/85 hover:text-white transition-colors tracking-wide text-sm">
                {t("Job Categories", "Job Categories")}
              </a>
              <a href="#technology" className="text-white/85 hover:text-white transition-colors tracking-wide text-sm">
                {t("How It Works", "How It Works")}
              </a>
              <a href="#standards" className="text-white/85 hover:text-white transition-colors tracking-wide text-sm">
                {t("Standards", "Standards")}
              </a>
              <a href="#commitments" className="text-white/85 hover:text-white transition-colors tracking-wide text-sm">
                {t("Protections", "Protections")}
              </a>
            </nav>

            {/* Center Brand with Official White Logo on Dark Hero Background */}
            <Link to="/" className="flex items-center justify-center gap-2 flex-1 lg:justify-center group cursor-pointer py-1" aria-label="TrustHyre Home">
              <img 
                src={trustHyreLightLogo} 
                alt="TrustHyre" 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain block select-none drop-shadow-lg group-hover:scale-105 transition-all duration-300" 
              />
            </Link>

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
                      <span>{t("Admin Hub", "Admin Hub")}</span>
                    </Link>
                  ) : isEmployer ? (
                    <>
                      <Link
                        to="/find-workers"
                        className="px-3.5 py-2 rounded-full text-xs font-medium text-white/90 hover:text-white transition-colors"
                      >
                        {t("Find Candidates", "Find Candidates")}
                      </Link>
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#0f2f63] hover:bg-[#5790e6] hover:text-white transition-colors"
                      >
                        {t("Dashboard", "Dashboard")}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/search"
                        className="px-3.5 py-2 rounded-full text-xs font-medium text-white/90 hover:text-white transition-colors"
                      >
                        {t("Find Jobs", "Find Jobs")}
                      </Link>
                      <Link
                        to="/applied-jobs"
                        className="px-4 py-2 rounded-full text-xs font-medium bg-white text-[#0f2f63] hover:bg-[#5790e6] hover:text-white transition-colors"
                      >
                        {t("My Jobs", "My Jobs")}
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
                    {t("Worker Login", "Worker Login")}
                  </Link>
                  <Link
                    to="/sign-in?role=employer"
                    className="hidden sm:inline-flex text-white/80 hover:text-white uppercase tracking-wider text-xs transition-colors"
                  >
                    {t("Employer Login", "Employer Login")}
                  </Link>
                  <Link
                    to="/find-workers"
                    className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {t("Explore Workers", "Explore Workers")}
                  </Link>
                </>
              )}

              {/* Language Switcher Pill */}
              <div className="relative shrink-0" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 backdrop-blur-xs hover:bg-white/25 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer select-none"
                  aria-label="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="font-bold text-[11px] uppercase tracking-wider text-white">
                    {language}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-white/70 shrink-0 transition-transform duration-200 ${isLangMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-[#0a0a0a] rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 overflow-hidden font-['Onest',system-ui,sans-serif]">
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Language / மொழி / भाषा
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            isSelected ? "bg-[#0f2f63]/10 text-[#0f2f63] font-bold" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs text-[#0A1931]">{lang.native}</div>
                            <div className="text-[10px] text-slate-400">{lang.name}</div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0f2f63] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

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
              {t(HERO_MODES[heroModeIdx].title, HERO_MODES[heroModeIdx].title)
                .split(' ')
                .map((word, wIdx) => (
                  <span 
                    key={`${heroModeIdx}-${word}-${wIdx}`} 
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
                <span>{t("Find Jobs", "Find Jobs")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/find-workers"
                className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-medium text-xs uppercase hover:bg-white/25 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t("Hire Talent", "Hire Talent")}</span>
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
                      {t(line, line)}
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
                <span className="font-medium uppercase tracking-wider">{t(HERO_MODES[heroModeIdx].badge, HERO_MODES[heroModeIdx].badge)}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/70">{t(LANDING_IMAGES.heroBackgrounds[activeHeroBgIdx].label, LANDING_IMAGES.heroBackgrounds[activeHeroBgIdx].label)}</span>
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
                      {t(HERO_COLLECTIONS[activeHeroCollection].brand, HERO_COLLECTIONS[activeHeroCollection].brand)}
                    </span>
                    <span className="text-[0.7rem] uppercase text-white/80 truncate">
                      {t(HERO_COLLECTIONS[activeHeroCollection].title, HERO_COLLECTIONS[activeHeroCollection].title)}
                    </span>
                    <Link 
                      to="/sign-up?role=employer" 
                      className="text-[0.65rem] underline text-[#5790e6] hover:text-white mt-1 transition-colors"
                    >
                      {t(HERO_COLLECTIONS[activeHeroCollection].cta, HERO_COLLECTIONS[activeHeroCollection].cta)} →
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
            
            {/* Direct Verification Seal */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#f4f4f4] border border-[#e6e8ec] flex flex-col items-center justify-center p-2.5 text-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#2563c9] mb-1" />
              <span className="text-xs font-semibold tracking-tight text-[#0a0a0a] uppercase">{t("Direct", "Direct")}</span>
              <span className="text-[0.65rem] text-[#717784] max-w-[9em] leading-tight uppercase tracking-wider">
                {t("Verified Pay", "Verified Pay")}
              </span>
            </div>

            {/* Badge Card */}
            <article className="max-w-md bg-[#f4f4f4] rounded-[1.5rem] p-4 sm:p-5 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-white px-3 py-1 text-xs font-medium text-[#0a0a0a] shadow-xs">
                  #01
                </span>
                <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a] tracking-tight">
                  {t("Direct Work & Hiring", "Direct Work & Hiring")}
                </h3>
              </div>
              <p className="text-sm text-[#717784] leading-relaxed">
                {t("Built for cooks, electricians, drivers, helpers, and local businesses. Daily photo check-ins and safe advance payments ensure reliable attendance and direct, guaranteed payouts.", "Built for cooks, electricians, drivers, helpers, and local businesses. Daily photo check-ins and safe advance payments ensure reliable attendance and direct, guaranteed payouts.")}
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
                    {t(currentSlide.headline[0], currentSlide.headline[0])}
                  </span>
                </span>
                <span className="overflow-hidden inline-block pb-[0.08em]">
                  <span className="inline-block text-[#d7dae1] animate-[ghostSlideUp_700ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {t(currentSlide.headline[1], currentSlide.headline[1])}
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
                    {t(currentSlide.headline[2], currentSlide.headline[2])}
                  </span>
                </span>
                <span className="overflow-hidden inline-block pb-[0.08em]">
                  <span className="inline-block text-[#d7dae1] animate-[ghostSlideUp_700ms_cubic-bezier(0.16,1,0.3,1)_forwards]">
                    {t(currentSlide.headline[3], currentSlide.headline[3])}
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
                <p className="text-sm sm:text-base font-medium tracking-tight truncate">{currentSlide.name}</p>
                <p className="text-xs text-white/90 uppercase tracking-wide mt-0.5 truncate">{t(currentSlide.role, currentSlide.role)}</p>
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
                <span>{t("Enterprise Sectors", "Enterprise Sectors")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.96]">
                {t("Every industry", "Every industry")} <br /> {t("on demand", "on demand")}
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
                      <span className="w-8 sm:w-10 text-sm font-medium text-[#717784]">
                        {track.index}
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 flex-1">
                        <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a] min-w-[16rem]">
                          {t(track.name, track.name)}
                        </h3>
                        <p className="text-sm sm:text-[15px] text-[#717784] max-w-lg leading-relaxed">
                          {t(track.description, track.description)}
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
                {t("Real Attendance & Safe Advance Pay", "Real Attendance & Safe Advance Pay")}
              </h2>

              <p className="text-sm sm:text-base text-[#717784] mt-4 leading-relaxed max-w-md">
                {t("Every worker does a quick photo and location check-in on arrival, and pay is held safely in advance so workers always get paid on time.", "Every worker does a quick photo and location check-in on arrival, and pay is held safely in advance so workers always get paid on time.")}
              </p>
            </div>

            {/* Staggered Verification Cards */}
            <div className="flex items-end gap-4">
              
              {/* Tile 1: Photo & Location Check-in */}
              <figure className="flex-1 aspect-[3/4] rounded-[1.5rem] overflow-hidden relative bg-[#f4f4f4] group shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src={LANDING_IMAGES.biometricGeofence.src} 
                  alt={LANDING_IMAGES.biometricGeofence.alt}
                  className="w-full h-full object-cover" 
                />
                <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-[#0f2f63]/60 backdrop-blur-md p-2.5 text-white text-left shadow-lg">
                  <p className="text-sm sm:text-base font-medium tracking-tight">{t("Photo & Location Check-in", "Photo & Location Check-in")}</p>
                  <p className="text-xs text-white/90 leading-normal mt-1">
                    {t("Quick photo check-in confirms the right worker arrived at the site.", "Quick photo check-in confirms the right worker arrived at the site.")}
                  </p>
                </figcaption>
              </figure>

              {/* Tile 2: Protected Advance Pay (Staggered mb-6) */}
              <figure className="flex-1 aspect-[3/4] rounded-[1.5rem] overflow-hidden relative bg-[#f4f4f4] mb-6 group shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src={LANDING_IMAGES.digitalEscrowVault.src} 
                  alt={LANDING_IMAGES.digitalEscrowVault.alt}
                  className="w-full h-full object-cover" 
                />
                <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-xl bg-[#0b6e97]/60 backdrop-blur-md p-2.5 text-white text-left shadow-lg">
                  <p className="text-sm sm:text-base font-medium tracking-tight">{t("Protected Advance Pay", "Protected Advance Pay")}</p>
                  <p className="text-xs text-white/90 leading-normal mt-1">
                    {t("Pay is deposited safely before work starts and paid directly to bank or UPI upon approval.", "Pay is deposited safely before work starts and paid directly to bank or UPI upon approval.")}
                  </p>
                </figcaption>
              </figure>

            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. OPERATING STANDARDS SECTION (Deep Navy Band - Tight Spacing) */}
        {/* =================================================================== */}
        <section 
          id="standards" 
          className="mt-3 rounded-[2rem] bg-[#0f2f63] text-white py-12 sm:py-14 px-6 sm:px-10"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/70 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5790e6]" />
                <span>{t("Operating Principles", "Operating Principles")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-[0.96]">
                {t("Architected for accountability", "Architected for accountability")}
              </h2>
            </div>

            {/* 4-Up Operating Standards Grid */}
            <dl className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {OPERATING_STANDARDS.map((std) => (
                <div key={std.number} className="border-t border-white/20 pt-4 text-left">
                  <dt className="sr-only">{t(std.title, std.title)}</dt>
                  <dd>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#5790e6]">
                        {std.number}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
                        {t(std.subtitle, std.subtitle)}
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-medium text-white tracking-tight leading-snug">
                      {t(std.title, std.title)}
                    </div>
                    <p className="text-sm text-white/75 mt-2 leading-relaxed">
                      {t(std.desc, std.desc)}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 6. PLATFORM COMMITMENTS SECTION (Tight Spacing) */}
        {/* =================================================================== */}
        <section id="commitments" className="py-10 sm:py-14 px-6 sm:px-10 bg-white text-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#717784] mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
                <span>{t("Platform Commitments", "Platform Commitments")}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a0a0a] leading-[0.96]">
                {t("Clear rules for both sides", "Clear rules for both sides")}
              </h2>
              <p className="text-sm sm:text-base text-[#717784] mt-3 max-w-xl leading-relaxed">
                {t("TrustHyre replaces verbal agreements and contractor middle-men with transparent hiring protections for employers and workers alike.", "TrustHyre replaces verbal agreements and contractor middle-men with transparent hiring protections for employers and workers alike.")}
              </p>
            </div>

            {/* 3-Up Cards */}
            <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLATFORM_COMMITMENTS.map((card, idx) => (
                <li key={idx}>
                  <div className="flex flex-col justify-between h-full rounded-[1.5rem] bg-[#f4f4f4] p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-1.5 shadow-xs">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${card.badgeColor}`}>
                        {t(card.badge, card.badge)}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-medium text-[#0a0a0a] tracking-tight leading-snug">
                        {t(card.title, card.title)}
                      </h3>
                      <p className="text-sm text-[#717784] mt-2 leading-relaxed">
                        {t(card.desc, card.desc)}
                      </p>
                    </div>

                    <ul className="border-t border-[#e6e8ec] pt-4 mt-5 space-y-2.5">
                      {card.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-sm text-[#0a0a0a] leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#2563c9] shrink-0 mt-0.5" />
                          <span>{t(pt, pt)}</span>
                        </li>
                      ))}
                    </ul>
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
                  {t("Explore the TrustHyre application", "Explore the TrustHyre application")}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/search"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#0f2f63] font-medium text-xs uppercase hover:bg-[#5790e6] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{t("Browse Jobs", "Browse Jobs")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/find-workers"
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/30 text-white font-medium text-xs uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t("Explore Candidates", "Explore Candidates")}</span>
                </Link>
              </div>
            </div>

            {/* Columns Grid */}
            <div className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-white/15 text-left">
              
              {/* Brand Column with Official White Logo */}
              <div className="space-y-4 max-w-xs">
                <div className="flex items-center gap-2.5">
                  <Link to="/" className="group inline-block" aria-label="TrustHyre Home">
                    <img 
                      src={trustHyreLightLogo} 
                      alt="TrustHyre" 
                      className="h-12 sm:h-14 w-auto object-contain block select-none drop-shadow-md group-hover:opacity-90 transition-opacity" 
                    />
                  </Link>
                </div>

                <p className="text-sm text-white/80 leading-relaxed">
                  {t("A simple, trusted platform connecting skilled workers with verified local employers. Safe advance payments, daily photo check-ins, and direct payouts with zero middle-men fees.", "A simple, trusted platform connecting skilled workers with verified local employers. Safe advance payments, daily photo check-ins, and direct payouts with zero middle-men fees.")}
                </p>
              </div>

              {/* Column: For Employers */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
                  {t("For Employers", "For Employers")}
                </h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li><Link to="/find-workers" className="hover:text-white transition-colors">{t("Browse Candidates", "Browse Candidates")}</Link></li>
                  <li><Link to="/post-job" className="hover:text-white transition-colors">{t("Post a Job", "Post a Job")}</Link></li>
                </ul>
              </div>

              {/* Column: For Workers */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
                  {t("For Workers", "For Workers")}
                </h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li><Link to="/search" className="hover:text-white transition-colors">{t("Find Jobs", "Find Jobs")}</Link></li>
                  <li><Link to="/sign-up?role=worker" className="hover:text-white transition-colors">{t("Worker Registration", "Worker Registration")}</Link></li>
                </ul>
              </div>

              {/* Column: Access & Legal */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
                  {t("Access & Legal", "Access & Legal")}
                </h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li><Link to="/sign-in" className="hover:text-white transition-colors">{t("Sign In", "Sign In")}</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">{t("Terms of Service", "Terms of Service")}</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">{t("Privacy Policy", "Privacy Policy")}</Link></li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar: Clean Production Attribution & Accessible Language Selector */}
            <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/70">
              <p>© 2026 TrustHyre. Safe, guaranteed hiring for verified workers and businesses.</p>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Direct Language Switcher Bar in Footer */}
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                  <Globe className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-[11px] font-semibold text-white/70 mr-1">Language:</span>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        language === lang.code
                          ? "bg-white text-[#0f2f63] shadow-xs"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                  <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
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
