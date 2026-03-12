import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  CheckCircle, 
  HardHat, 
  Hammer, 
  MapPin, 
  Wallet, 
  Zap, 
  Trophy, 
  ShieldCheck, 
  CircleDollarSign,
  Clock,
  UserCheck,
  Bell,
  ShieldAlert,
  BadgeCheck,
  Briefcase, 
  Smartphone
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Aadhaar Face Match",
    desc: "Privacy-first verification using SHA-256 hashing. Your data is encrypted and secure.",
  },
  {
    num: "02",
    title: "L1 Certification",
    desc: "Pass a quick skill assessment to earn your 🌱 Beginner badge and unlock job discovery.",
  },
  {
    num: "03",
    title: "Hyperlocal Match",
    desc: "AI-driven matching finds jobs with high-trust employers within 5-50km of you.",
  },
  {
    num: "04",
    title: "Instant Settlement",
    desc: "Complete the job and receive your salary directly to your bank via digital settlement.",
  },
];

const PERKS = [
  "L4 Elite Pay Bands (₹25k+)",
  "Accidental Insurance Cover",
  "Smart Rating-based Hikes",
  "Digitally Signed Contracts",
];

const TRUST_POINTS = [
  { icon: <ShieldAlert className="w-5 h-5" />, title: "SHA-256 Privacy", desc: "We never store your full Aadhaar number. Only masked tokens are used." },
  { icon: <UserCheck className="w-5 h-5" />, title: "AI Face Liveness", desc: "Advanced biometric matching ensure zero fake profiles on the platform." },
  { icon: <BadgeCheck className="w-5 h-5" />, title: "L1-L4 Badging", desc: "Build a reputation that employers trust. Higher levels = Higher daily payout." },
];

const TIMELINE = [
  { time: "5 PM", event: "Work Done", icon: <Hammer className="w-4 h-4" /> },
  { time: "6 PM", event: "Employer Check", icon: <UserCheck className="w-4 h-4" /> },
  { time: "8 PM", event: "Money in Bank", icon: <CircleDollarSign className="w-4 h-4 text-green-500" /> },
];

export function LandingEarnings() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const workerY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const iconY1 = useTransform(scrollYProgress, [0, 1], [20, -100]);
  const iconY2 = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const iconY3 = useTransform(scrollYProgress, [0, 1], [-30, 80]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 sm:py-32 lg:py-48 bg-brand-cream relative overflow-hidden z-10">
      
      {/* 1. Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--brand-teal, #1d4744) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* 2. Abstract Mesh Backgrounds */}
      <motion.div 
        style={{ y: blob1Y }}
        className="absolute top-20 right-[5%] w-[600px] h-[600px] bg-linear-to-br from-brand-teal/20 to-transparent rounded-full blur-[120px] z-0" 
      />
      <motion.div 
        style={{ y: blob2Y }}
        className="absolute bottom-10 left-[10%] w-[400px] h-[400px] bg-linear-to-tr from-brand-amber/15 to-transparent rounded-full blur-[100px] z-0" 
      />

      {/* ── Background Icon Ecosystem: ENHANCED VISIBILITY ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: iconY1 }} className="absolute top-[10%] right-[15%] text-brand-teal/15 rotate-12">
          <CircleDollarSign size={200} />
        </motion.div>
        <motion.div style={{ y: iconY2 }} className="absolute bottom-[20%] left-[5%] text-brand-amber/15 -rotate-12">
          <Clock size={160} />
        </motion.div>
        <motion.div style={{ y: iconY3 }} className="absolute top-[40%] left-[2%] text-brand-teal/10">
          <Bell size={120} />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-32 items-center mb-24 lg:mb-32">
          
          {/* Left Column: Process Steps */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 lg:mb-16"
            >
              <span className="inline-flex items-center gap-2 text-brand-amber font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 sm:mb-6 bg-white shadow-sm border border-brand-amber/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <Zap className="w-3 h-3 fill-current" />
                Simple Process
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[#111] leading-[1.1] tracking-tight">
                Start earning in{" "}
                <span className="text-brand-teal relative inline-block">
                  4 steps
                  <motion.svg 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full overflow-visible" 
                    height="12" 
                    viewBox="0 0 100 12" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0,8 Q50,0 100,8" stroke="var(--brand-amber, #f0b429)" strokeWidth="6" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line through steps */}
              <div className="absolute left-5 sm:left-6 top-10 bottom-0 w-1 bg-linear-to-b from-brand-teal/20 via-brand-teal/10 to-transparent" />
              
              <div className="space-y-4">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex gap-5 sm:gap-8 group relative bg-white/40 hover:bg-white/80 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] transition-all duration-500 border border-transparent hover:border-white hover:shadow-xl hover:shadow-brand-teal/5"
                  >
                    <div className="shrink-0 relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-md border border-brand-teal/10 flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110">
                        <span className="text-xs sm:text-sm font-black italic">{step.num}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-[#111] mb-1.5 sm:mb-2 transition-colors group-hover:text-brand-teal">{step.title}</h4>
                      <p className="text-[#555] font-medium leading-relaxed text-sm sm:max-w-[340px] opacity-80 group-hover:opacity-100 transition-opacity">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div style={{ y: iconY1 }} className="absolute bottom-[5%] right-[25%] text-brand-teal/5 rotate-12 hidden sm:block">
              <MapPin size={70} strokeWidth={1} />
            </motion.div>
          </div>

          {/* Right Column: Visual Composition - OPTIMIZED FOR MOBILE STACKING */}
          <div className="relative h-auto lg:h-[800px] flex flex-col items-center justify-center pt-20 lg:pt-0">
            
            {/* Background Decorative Icons - REDUCED ON MOBILE */}
            <motion.div style={{ y: iconY1 }} className="absolute -top-[5%] left-[5%] text-brand-teal/20 -rotate-12 hidden sm:block">
              <HardHat className="w-16 h-16 lg:w-[90px] lg:h-[90px]" strokeWidth={0.5} />
            </motion.div>
            <motion.div style={{ y: iconY3 }} className="absolute bottom-[40%] right-[-5%] text-brand-amber/20 rotate-6 hidden lg:block">
              <Briefcase size={80} strokeWidth={0.5} />
            </motion.div>
            <motion.div style={{ y: iconY1 }} className="absolute top-[15%] left-[15%] text-brand-teal/20 rotate-45 hidden sm:block">
              <Smartphone className="w-16 h-16 lg:w-[110px] lg:h-[110px]" strokeWidth={0.5} />
            </motion.div>
            
            {/* Main Central Image with Parallax & Stylized Container */}
            <motion.div
              style={{ y: window.innerWidth >= 1024 ? workerY : 0 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 w-full max-w-[320px] sm:max-w-[450px] lg:max-w-[520px] aspect-4/5 rounded-[40px] sm:rounded-[60px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] lg:shadow-[0_60px_120px_rgba(0,0,0,0.12)] border-8 sm:border-12 border-white backdrop-blur-sm group mb-12 lg:mb-0"
            >
              <img 
                src="/assets/landing/trusthyre-worker.png" 
                alt="TrustHyre Skilled Worker" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating Cards & Badges - RE-STACKED FOR MOBILE */}
            <div className="flex flex-col sm:flex-row lg:block gap-6 w-full lg:static">
              
              {/* Glassmorphism Earnings Card */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="lg:absolute lg:top-[30%] lg:-left-8 xl:-left-20 z-30 w-full sm:w-[320px] p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-white/95 backdrop-blur-2xl border border-white/60 shadow-xl lg:shadow-[0_40px_80px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <Wallet size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[1.5px] text-brand-teal/60 block">Daily Wallet</span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#111]">Updated Live</span>
                  </div>
                </div>
                <h3 className="text-4xl sm:text-6xl font-black text-[#111] mb-2 tracking-tighter">₹2,450</h3>
                <div className="flex items-center gap-2 mb-6 sm:mb-8 bg-green-50 py-1.5 px-3 rounded-lg sm:rounded-xl w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] font-black text-green-700 uppercase tracking-wider">Settled to Bank</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                  {PERKS.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2.5 group/perk">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold text-[#444]">{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-col lg:block gap-6 flex-1">
                {/* Achievement Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="lg:absolute lg:top-[5%] lg:-right-6 z-40 bg-brand-amber text-[#111] p-5 sm:p-6 rounded-[28px] sm:rounded-[34px] shadow-xl shadow-brand-amber/20 flex items-center gap-4 hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black leading-none mb-1 text-white">94%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#111]/80">Retention</p>
                  </div>
                </motion.div>

                {/* Verified Badge */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="lg:absolute lg:bottom-[5%] lg:-right-6 xl:-right-12 z-40 bg-white shadow-xl p-5 sm:p-6 rounded-[28px] sm:rounded-[36px] border border-gray-100 flex items-center gap-4 sm:gap-5"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-black text-[#111] leading-none mb-1">L1 Professional</p>
                    <p className="text-[9px] sm:text-[11px] text-[#888] font-black uppercase tracking-widest">Skill Verified</p>
                  </div>
                </motion.div>
              </div>

            </div>

            {/* Abstract Decorative Circles - HIDDEN ON MOBILE */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-brand-teal/5 rounded-full z-0 hidden lg:block" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-brand-teal/3 rounded-full z-0 hidden lg:block" />

          </div>
        </div>

        {/* ── NEW: Expanded Trust & Timeline Sections ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Trust Points Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 bg-white p-10 lg:p-14 rounded-[48px] shadow-xl shadow-brand-teal/5 border border-brand-teal/5"
          >
            <h3 className="text-2xl lg:text-3xl font-black text-[#111] mb-8">Why 50,000+ workers <span className="text-brand-teal">trust us</span></h3>
            <div className="grid gap-8">
              {TRUST_POINTS.map((point, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-teal/5 text-brand-teal flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
                    {point.icon}
                  </div>
                  <div>
                    <h5 className="text-lg font-black text-[#111] mb-1">{point.title}</h5>
                    <p className="text-sm text-[#666] font-medium leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Daily Payout Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-brand-teal p-10 lg:p-14 rounded-[48px] text-white overflow-hidden relative"
          >
            {/* Background pattern for timeline */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <h3 className="text-2xl lg:text-3xl font-black mb-10">Same-Day Payout <span className="text-brand-amber">Cycle</span></h3>
            
            <div className="relative space-y-12">
              {/* Vertical dotted line */}
              <div className="absolute left-[23px] top-2 bottom-2 w-0.5 border-l-2 border-dashed border-white/20" />
              
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex items-center gap-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-brand-amber uppercase tracking-widest">{item.time}</span>
                      {i === TIMELINE.length - 1 && <span className="px-2 py-0.5 bg-green-500 rounded text-[10px] font-black uppercase">Live</span>}
                    </div>
                    <p className="text-xl font-black leading-none">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-10 border-t border-white/10">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-brand-amber flex items-center justify-center text-brand-teal shrink-0">
                  <Zap size={20} fill="currentColor" />
                </div>
                <p className="text-xs font-bold leading-relaxed opacity-80">
                  Join the Waitlist to get exclusive early access to Instant Digital Settlements.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
