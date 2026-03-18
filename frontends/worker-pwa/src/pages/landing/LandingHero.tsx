import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ChefHat, 
  Truck, 
  HardHat, 
  Hammer, 
  Wrench, 
  Briefcase, 
  Smartphone,
  Wallet,
  MapPin,

} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
// import { useLanguage } from "../../hooks/useLanguage";

export function LandingHero() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  // const { t } = useLanguage();

  useEffect(() => {
    // Simulate loading time for the "premium" feel
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const iconY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const iconY2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const iconY3 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // ── Mouse Parallax for Tech Grid ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const moveX = useTransform(springX, [0, 1500], [-30, 30]);
  const moveY = useTransform(springY, [0, 1000], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);
  
  return (
    <section ref={containerRef} className="relative z-10 w-full overflow-hidden bg-brand-bg pt-20 lg:pt-24 pb-12 min-h-svh flex flex-col justify-center selection:bg-brand-primary selection:text-brand-secondary">
      
      {/* ── Premium Preloader ── */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-brand-bg flex flex-col items-center justify-center gap-6"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-brand-secondary/10 border-t-brand-primary rounded-full shadow-[0_0_15px_rgba(250,204,21,0.2)]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/assets/landing/flag.png" alt="India" className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white" />
            </div>
          </div>
          <motion.p 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-brand-secondary font-bold tracking-[0.2em] text-xs"
          >
            Trust Hire India
          </motion.p>
        </motion.div>
      )}
      
      {/* ── Interactive Tech Grid ── */}
      <motion.div 
        style={{ x: moveX, y: moveY }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 cloud-grid opacity-[0.05]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-bg/40 to-brand-bg" />
      </motion.div>
      
      {/* ── Animated Dual-Image Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Left Side: Construction Animation */}
         <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1],
            x: [0, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-10%] top-[-15%] w-[60%] h-[110%] opacity-40 origin-top-left hidden lg:block"
        >
          <img
            src="/assets/landing/hero-construction.png"
            alt="Construction"
            className="w-full h-full object-contain saturate-150 brightness-105"
          />
        </motion.div>

        {/* Right Side: Professional Animation */}
         <motion.div
          animate={{ 
            scale: [1.05, 1, 1.05],
            rotate: [1, -1, 1],
            y: [0, -20, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-5%] top-[-20%] w-[60%] h-[110%] opacity-40 origin-top-right hidden lg:block"
        >
          <img
            src="/assets/landing/hero-professional.png"
            alt="Professional"
            className="w-full h-full object-contain saturate-150 brightness-105"
          />
        </motion.div>

        {/* ── Background Icon Ecosystem ── */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: iconY1 }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute top-[10%] left-[5%] text-brand-secondary/10">
            <HardHat className="w-16 h-16 sm:w-24 sm:h-24 lg:w-[120px] lg:h-[120px]" strokeWidth={1} />
          </motion.div>
          <motion.div style={{ y: iconY2 }} animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[5%] right-[10%] text-brand-primary/20">
            <ChefHat className="w-20 h-20 sm:w-28 sm:h-28 lg:w-[140px] lg:h-[140px]" strokeWidth={1} />
          </motion.div>
          <motion.div style={{ y: iconY3 }} animate={{ x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-[25%] left-[8%] text-brand-secondary/10 hidden sm:block">
            <Truck className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[100px] lg:h-[100px]" strokeWidth={1} />
          </motion.div>
          <motion.div style={{ y: iconY2 }} className="absolute bottom-[20%] right-[15%] text-brand-primary/10 rotate-12 hidden lg:block">
            <Wrench size={80} strokeWidth={1.5} />
          </motion.div>
          <motion.div style={{ y: iconY1 }} animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute top-[35%] left-[2%] text-brand-secondary/5 hidden sm:block">
            <Hammer className="w-20 h-20 sm:w-32 sm:h-32 lg:w-[160px] lg:h-[160px]" strokeWidth={0.5} />
          </motion.div>
          <motion.div style={{ y: iconY3 }} className="absolute top-[40%] right-[5%] text-brand-secondary/10 -rotate-6 hidden lg:block">
            <Briefcase size={90} strokeWidth={1} />
          </motion.div>
          <motion.div animate={{ scale: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-[45%] right-[12%] text-brand-primary/15 hidden sm:block">
            <Wallet className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px]" strokeWidth={1.5} />
          </motion.div>
          <motion.div style={{ y: iconY1 }} className="absolute top-[20%] left-[25%] text-brand-secondary/5 rotate-45 hidden lg:block">
            <Smartphone size={110} strokeWidth={0.5} />
          </motion.div>
          <motion.div style={{ y: iconY3 }} className="absolute bottom-[25%] right-[32%] text-brand-primary/10 -rotate-12 hidden sm:block">
            <MapPin className="w-14 h-14 sm:w-20 sm:h-20 lg:w-[90px] lg:h-[90px]" strokeWidth={0.5} />
          </motion.div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-brand-bg/40 via-brand-primary/[0.03] to-brand-bg pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col items-center">
        
        {/* ── TOP: Centered Headline & Content ── */}
        <div className="text-center max-w-4xl mx-auto space-y-6 lg:space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 lg:px-8 lg:py-4 bg-white shadow-2xl shadow-brand-secondary/5 text-brand-secondary rounded-full text-xs sm:text-sm font-semibold tracking-tight border border-brand-border mb-8 lg:mb-12 transform hover:scale-105 transition-all cursor-default group">
              <img src="/assets/landing/flag.png" alt="India Flag" className="w-6 h-6 rounded-full object-cover shadow-md border border-brand-primary/20 group-hover:rotate-12 transition-transform" />
              <span className="text-brand-secondary/60">India's <span className="text-brand-secondary">#1</span> Trusted Network</span>
            </div>
            
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[110px] font-bold text-brand-secondary leading-[1] tracking-tight max-w-5xl">
              India's 🇮🇳 Safest <br className="hidden sm:block" />
              <span className="text-brand-secondary/30">app for</span>{' '}
              <span className="relative inline-block mt-2 sm:mt-0">
                <span className="relative z-10 text-brand-primary px-4 sm:px-8 py-1 sm:py-3 font-bold">Daily Work</span>
                <span className="absolute inset-0 bg-brand-secondary rounded-3xl -rotate-1 z-0 shadow-2xl" />
              </span>{' '}
              <span className="text-brand-primary/60">&</span> Jobs.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl text-brand-secondary/60 max-w-2xl mx-auto leading-relaxed font-medium px-4 sm:px-0"
          >
            Ensuring high-integrity verification for every professional connection through India's most secure digital protocol.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-6 pt-6"
          >
            <Link
              to="/sign-up"
              className="group flex items-center justify-center gap-4 px-10 py-5 lg:px-12 bg-linear-to-r from-brand-secondary to-neutral-800 text-brand-primary rounded-3xl font-semibold text-lg transition-all shadow-2xl shadow-brand-secondary/20 active:scale-95 tracking-tight"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <button className="flex items-center justify-center gap-4 px-10 py-5 lg:px-12 text-brand-secondary bg-white border border-brand-border rounded-3xl font-semibold text-lg hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 shadow-lg group">
              <Play className="w-6 h-6 fill-brand-primary text-brand-primary group-hover:scale-110 transition-transform" />
              Watch Video
            </button>
          </motion.div>
          
          {/* Trust stats below buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-x-8 lg:gap-x-14 gap-y-8 pt-12 lg:pt-16"
          >
            {[
              { icon: <Users className="w-6 h-6 text-brand-primary" />, value: "50k+", label: "Verified Professionals" },
              { icon: <TrendingUp className="w-6 h-6 text-brand-primary" />, value: "₹2,450", label: "Average Daily Payout" },
              { icon: <ShieldCheck className="w-6 h-6 text-brand-primary" />, value: "4.9★", label: "Safety Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 min-w-[180px] justify-start sm:justify-center group">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl border border-brand-border shrink-0 group-hover:rotate-6 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-2xl lg:text-3xl font-semibold text-brand-secondary leading-none mb-1.5">{stat.value}</p>
                  <p className="text-[10px] lg:text-[11px] text-brand-secondary/40 font-medium tracking-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Decorative side badge
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center">
        <div className="bg-brand-secondary/95 backdrop-blur-3xl border-l border-y border-brand-primary/20 rounded-l-[2.5rem] p-5 flex flex-col gap-10 shadow-3xl">
            <div className="text-brand-primary vertical-text font-semibold text-[10px] tracking-[0.2em] py-4 whitespace-nowrap">Protocol secured</div>
           <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-brand-primary shadow-[0_0_10px_rgba(250,204,21,0.3)]" />
           </div>
        </div>
      </div> */}
    </section>
  );
}
