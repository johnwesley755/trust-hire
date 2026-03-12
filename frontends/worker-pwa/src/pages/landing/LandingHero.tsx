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
  MapPin
} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

export function LandingHero() {
  const containerRef = useRef(null);
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
    <section ref={containerRef} className="relative z-10 w-full overflow-hidden bg-brand-cream pt-28 lg:pt-32 pb-12 min-h-svh flex flex-col justify-center">
      
      {/* ── Visual Impact: Interactive Tech Grid ── */}
      <motion.div 
        style={{ x: moveX, y: moveY }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div 
          className="absolute inset-[-100px] opacity-[0.08]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #1d4744 1px, transparent 1px), linear-gradient(to bottom, #1d4744 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} 
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-brand-cream/40 to-brand-cream" />
      </motion.div>
      
      {/* ── Animated Dual-Image Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Left Side: Construction Animation - HIDDEN ON MOBILE */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1],
            x: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-10%] top-[10%] w-[60%] h-[120%] opacity-40 origin-bottom-left hidden lg:block"
        >
          <img
            src="/assets/landing/hero-construction.png"
            alt="Construction"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </motion.div>

        {/* Right Side: Professional Animation - HIDDEN ON MOBILE */}
        <motion.div
          animate={{ 
            scale: [1.05, 1, 1.05],
            rotate: [1, -1, 1],
            y: [0, -15, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-5%] top-[5%] w-[60%] h-[120%] opacity-40 origin-bottom-right hidden lg:block"
        >
          <img
            src="/assets/landing/hero-professional.png"
            alt="Professional"
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </motion.div>

        {/* ── Background Icon Ecosystem: OPTIMIZED FOR MOBILE ── */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: iconY1 }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute top-[15%] left-[5%] text-brand-teal/20">
            <HardHat className="w-16 h-16 sm:w-24 sm:h-24 lg:w-[120px] lg:h-[120px]" strokeWidth={1} />
          </motion.div>
          <motion.div style={{ y: iconY2 }} animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[10%] right-[10%] text-brand-amber/30">
            <ChefHat className="w-20 h-20 sm:w-28 sm:h-28 lg:w-[140px] lg:h-[140px]" strokeWidth={1} />
          </motion.div>
          <motion.div style={{ y: iconY3 }} animate={{ x: [-10, 10, -10] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-[20%] left-[8%] text-brand-teal/20 hidden sm:block">
            <Truck className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[100px] lg:h-[100px]" strokeWidth={1} />
          </motion.div>
          <motion.div style={{ y: iconY2 }} className="absolute bottom-[15%] right-[15%] text-brand-amber/20 rotate-12 hidden lg:block">
            <Wrench size={80} strokeWidth={1.5} />
          </motion.div>
          <motion.div style={{ y: iconY1 }} animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] left-[2%] text-brand-teal/15 hidden sm:block">
            <Hammer className="w-20 h-20 sm:w-32 sm:h-32 lg:w-[160px] lg:h-[160px]" strokeWidth={0.5} />
          </motion.div>
          <motion.div style={{ y: iconY3 }} className="absolute top-[45%] right-[5%] text-brand-teal/20 -rotate-6 hidden lg:block">
            <Briefcase size={90} strokeWidth={1} />
          </motion.div>
          <motion.div animate={{ scale: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-[40%] right-[12%] text-brand-amber/20 hidden sm:block">
            <Wallet className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px]" strokeWidth={1.5} />
          </motion.div>
          <motion.div style={{ y: iconY1 }} className="absolute top-[25%] left-[25%] text-brand-teal/15 rotate-45 hidden lg:block">
            <Smartphone size={110} strokeWidth={0.5} />
          </motion.div>
          <motion.div style={{ y: iconY3 }} className="absolute bottom-[20%] right-[32%] text-brand-amber/15 -rotate-12 hidden sm:block">
            <MapPin className="w-14 h-14 sm:w-20 sm:h-20 lg:w-[90px] lg:h-[90px]" strokeWidth={0.5} />
          </motion.div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-brand-cream/40 via-transparent to-brand-cream pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col items-center">
        
        {/* ── TOP: Centered Headline & Content ── */}
        <div className="text-center max-w-4xl mx-auto space-y-6 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 lg:px-6 lg:py-3 bg-white shadow-xl shadow-brand-teal/5 text-brand-teal rounded-full text-xs sm:text-sm font-black uppercase tracking-[0.2em] border border-brand-teal/10 mb-6 lg:mb-8 transform hover:scale-105 transition-transform cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-brand-amber animate-pulse" />
              India's AI-Powered Verified Network
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[115px] font-black text-[#111] leading-[1.1] lg:leading-[0.95] tracking-tight">
              Scale your <br className="sm:hidden" />
              <span className="relative inline-block mt-2 sm:mt-0">
                <span className="relative z-10 text-white px-4 sm:px-8 py-1 sm:py-2">Career</span>
                <span className="absolute inset-0 bg-brand-teal rounded-xl sm:rounded-2xl -rotate-1 z-0 shadow-lg" />
              </span>
              <br />
              with <span className="text-brand-amber">Elite Tiers.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-[#555] max-w-2xl mx-auto leading-relaxed font-medium px-4 sm:px-0"
          >
            Join India's most trusted network of L1-L4 verified professionals. 
            Get matched with hyperlocal jobs, pass AI-skill tests, and level up 
            to ₹25,000+ monthly bands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 pt-4"
          >
            <Link
              to="/sign-up"
              className="group flex items-center justify-center gap-2 px-6 py-4 lg:px-8 bg-brand-teal hover:bg-[#2a5f5b] text-white rounded-2xl font-bold text-base sm:text-lg transition-all hover:shadow-[0_8px_30px_rgba(29,71,68,0.35)] hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center justify-center gap-3 px-6 py-4 lg:px-8 text-[#111] bg-white border-2 border-black/10 rounded-2xl font-bold text-base sm:text-lg hover:border-brand-teal hover:text-brand-teal transition-all hover:-translate-y-1 shadow-sm">
              <Play className="w-5 h-5 fill-current" />
              Watch Video
            </button>
          </motion.div>
          
          {/* Trust stats below buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-x-6 lg:gap-x-10 gap-y-6 pt-6 lg:pt-8"
          >
            {[
              { icon: <Users className="w-5 h-5 text-brand-amber" />, value: "50k+", label: "Verified Workers" },
              { icon: <TrendingUp className="w-5 h-5 text-brand-amber" />, value: "₹2,450", label: "Avg Earnings" },
              { icon: <ShieldCheck className="w-5 h-5 text-brand-amber" />, value: "4.9★", label: "Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 min-w-[140px] justify-start sm:justify-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5 shrink-0">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-lg lg:text-xl font-black text-[#111] leading-none mb-1">{stat.value}</p>
                  <p className="text-[10px] lg:text-xs text-[#777] font-semibold uppercase tracking-wide">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
