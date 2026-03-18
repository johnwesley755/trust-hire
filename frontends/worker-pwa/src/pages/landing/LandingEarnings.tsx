import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  HardHat, 
  Hammer, 
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
  Smartphone,
  Globe
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function LandingEarnings() {
  const { t } = useLanguage();
  const containerRef = useRef(null);

  const STEPS = [
    {
      num: "01",
      title: t('earnings.step.1.title'),
      desc: t('earnings.step.1.desc'),
    },
    {
      num: "02",
      title: t('earnings.step.2.title'),
      desc: t('earnings.step.2.desc'),
    },
    {
      num: "03",
      title: t('earnings.step.3.title'),
      desc: t('earnings.step.3.desc'),
    },
    {
      num: "04",
      title: t('earnings.step.4.title'),
      desc: t('earnings.step.4.desc'),
    },
  ];

  const PERKS = [
    t('earnings.perk.1'),
    t('earnings.perk.2'),
    t('earnings.perk.3'),
    t('earnings.perk.4'),
  ];

  const TRUST_POINTS = [
    { icon: <ShieldAlert className="w-5 h-5" />, title: t('earnings.trust.point.1.title'), desc: t('earnings.trust.point.1.desc') },
    { icon: <UserCheck className="w-5 h-5" />, title: t('earnings.trust.point.2.title'), desc: t('earnings.trust.point.2.desc') },
    { icon: <BadgeCheck className="w-5 h-5" />, title: t('earnings.trust.point.3.title'), desc: t('earnings.trust.point.3.desc') },
  ];

  const TIMELINE = [
    { time: t('earnings.timeline.1.time'), event: t('earnings.timeline.1.event'), icon: <Hammer className="w-4 h-4" /> },
    { time: t('earnings.timeline.2.time'), event: t('earnings.timeline.2.event'), icon: <UserCheck className="w-4 h-4" /> },
    { time: t('earnings.timeline.3.time'), event: t('earnings.timeline.3.event'), icon: <CircleDollarSign className="w-4 h-4 text-emerald-500" /> },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const workerY = useTransform(scrollYProgress, [0, 1], [-60, 20]); 
  const blob1Y = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const iconY1 = useTransform(scrollYProgress, [0, 1], [20, -100]);
  const iconY2 = useTransform(scrollYProgress, [0, 1], [50, -150]);
  const iconY3 = useTransform(scrollYProgress, [0, 1], [-30, 80]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 sm:py-32 lg:py-48 bg-brand-bg relative overflow-hidden z-10 selection:bg-brand-primary selection:text-brand-secondary">
      
      {/* 1. Background Grid Pattern */}
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />

      {/* 2. Abstract Mesh Backgrounds */}
      <motion.div 
        style={{ y: blob1Y }}
        className="absolute top-20 right-[5%] w-[600px] h-[600px] bg-linear-to-br from-brand-secondary/10 via-brand-primary/5 to-transparent rounded-full blur-[120px] z-0" 
      />
      <motion.div 
        style={{ y: blob2Y }}
        className="absolute bottom-10 left-[10%] w-[400px] h-[400px] bg-linear-to-tr from-brand-primary/10 via-brand-secondary/5 to-transparent rounded-full blur-[100px] z-0" 
      />

      {/* ── Background Icon Ecosystem ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: iconY1 }} className="absolute top-[10%] right-[15%] text-brand-secondary/5 rotate-12">
          <CircleDollarSign size={200} />
        </motion.div>
        <motion.div style={{ y: iconY2 }} className="absolute bottom-[20%] left-[5%] text-brand-primary/5 -rotate-12">
          <Clock size={160} />
        </motion.div>
        <motion.div style={{ y: iconY3 }} className="absolute top-[40%] left-[2%] text-brand-secondary/5">
          <Bell size={120} />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-32 items-center mb-24 lg:mb-32">
          
          {/* Left Column: Process Steps */}
          <div className="relative text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 lg:mb-20"
            >
              <span className="inline-flex items-center gap-3 text-brand-secondary font-semibold text-xs lg:text-sm tracking-tight mb-6 bg-brand-primary shadow-2xl px-6 py-3 rounded-full">
                <Zap className="w-4 h-4 fill-current animate-pulse" />
                {t('earnings.badge')}
              </span>
              <h2 className="text-5xl sm:text-7xl lg:text-[100px] font-bold text-brand-secondary leading-[0.9] tracking-tight whitespace-pre-line">
                {t('earnings.title')}{" "}
                <span className="text-brand-primary relative inline-block">
                  {t('earnings.title.steps')}
                  <motion.svg 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute -bottom-2 left-0 w-full overflow-visible" 
                    height="12" 
                    viewBox="0 0 100 12" 
                    preserveAspectRatio="none"
                  >
                    <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                  </motion.svg>
                </span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line through steps */}
              <div className="absolute left-6 sm:left-7 top-10 bottom-0 w-1 bg-brand-secondary/5" />
              
              <div className="space-y-6">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex gap-6 sm:gap-10 group relative bg-white/40 hover:bg-white/95 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] transition-all duration-500 border border-transparent hover:border-brand-border hover:shadow-2xl hover:shadow-brand-secondary/5"
                  >
                    <div className="shrink-0 relative z-10">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-bg shadow-xl border border-brand-border flex items-center justify-center group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110">
                        <span className="text-xs sm:text-sm font-semibold">{step.num}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-brand-secondary mb-2 transition-colors group-hover:text-neutral-900 tracking-tight">{step.title}</h4>
                      <p className="text-brand-secondary/40 font-medium leading-relaxed text-sm sm:max-w-[340px]">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="relative h-auto lg:h-[800px] flex flex-col items-center justify-center pt-20 lg:pt-0">
            
            {/* Background Decorative Icons */}
            <motion.div style={{ y: iconY1 }} className="absolute -top-[5%] left-[5%] text-brand-secondary/10 -rotate-12 hidden sm:block">
              <HardHat className="w-16 h-16 lg:w-[90px] lg:h-[90px]" strokeWidth={0.5} />
            </motion.div>
            <motion.div style={{ y: iconY3 }} className="absolute bottom-[40%] right-[-5%] text-brand-primary/10 rotate-6 hidden lg:block">
              <Briefcase size={80} strokeWidth={0.5} />
            </motion.div>
            <motion.div style={{ y: iconY1 }} className="absolute top-[15%] left-[15%] text-brand-secondary/10 rotate-45 hidden sm:block">
              <Smartphone className="w-16 h-16 lg:w-[110px] lg:h-[110px]" strokeWidth={0.5} />
            </motion.div>
            
            {/* Main Central Image */}
            <motion.div
              style={{ y: window.innerWidth >= 1024 ? workerY : 0 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20 w-full max-w-[320px] sm:max-w-[450px] lg:max-w-[550px] aspect-[4/5] rounded-[4rem] sm:rounded-[5.5rem] overflow-hidden shadow-2xl lg:shadow-[0_80px_160px_rgba(31,63,52,0.15)] border-[12px] sm:border-[16px] border-white backdrop-blur-sm group mb-12 lg:mb-0 transform-gpu"
            >
              <img 
                src="/assets/landing/trusthyre-worker.png" 
                alt="Professional Worker" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-secondary/30 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating Cards & Badges */}
            <div className="flex flex-col sm:flex-row lg:block gap-8 w-full lg:static">
              
              {/* Glassmorphism Earnings Card */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="lg:absolute lg:top-[30%] lg:-left-12 xl:-left-24 z-30 w-full sm:w-[340px] p-8 sm:p-10 rounded-[3.5rem] sm:rounded-[4.5rem] bg-white/95 backdrop-blur-3xl border border-brand-border shadow-2xl hover:scale-105 transition-transform text-left"
              >
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-14 h-14 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center shadow-xl">
                    <Wallet size={24} strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="text-[10px] font-medium tracking-tight text-brand-secondary/40 block">{t('earnings.card.wallet')}</span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-brand-secondary tracking-widest">{t('earnings.card.status')}</span>
                  </div>
                </div>
                <h3 className="text-5xl sm:text-7xl font-bold text-brand-secondary mb-4 tracking-tight">₹2,450</h3>
                <div className="flex items-center gap-3 mb-8 bg-emerald-50/50 py-3 px-5 rounded-2xl w-fit border border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="text-[11px] font-semibold text-emerald-700 tracking-tight">{t('earnings.card.settled')}</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {PERKS.map((perk, i) => (
                    <div key={i} className="flex items-center gap-3 group/perk">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] sm:text-xs font-medium text-brand-secondary/60 tracking-wide">{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-col lg:block gap-10 flex-1">
                {/* Achievement Badge */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="lg:absolute lg:top-[5%] lg:-right-8 z-40 bg-brand-primary text-brand-secondary p-8 sm:p-10 rounded-[3.5rem] sm:rounded-[4.5rem] shadow-2xl flex items-center gap-6 hover:scale-105 transition-transform group border-4 border-white"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-3xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-4xl sm:text-5xl font-bold leading-none mb-1 text-white">94%</p>
                    <p className="text-xs font-medium tracking-tight text-brand-secondary/60">{t('earnings.retention')}</p>
                  </div>
                </motion.div>

                {/* Verified Badge */}
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="lg:absolute lg:bottom-[5%] lg:-right-12 xl:-right-20 z-40 bg-white shadow-2xl p-8 sm:p-10 rounded-[3.5rem] sm:rounded-[4.5rem] border border-brand-border flex items-center gap-6 sm:gap-8 text-left group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-bg text-brand-secondary flex items-center justify-center shadow-xl group-hover:-rotate-12 transition-transform">
                    <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-brand-secondary leading-none mb-2 tracking-tight">{t('earnings.badge.l1')}</p>
                    <p className="text-[11px] sm:text-[12px] text-brand-secondary/40 font-medium tracking-tight">{t('earnings.badge.verified')}</p>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Trust & Timeline Sections ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Trust Points Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl shadow-brand-secondary/5 border border-brand-border text-left"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-brand-secondary mb-10 tracking-tight">
              {t('earnings.trust.title')}{" "}
              <span className="text-brand-primary">{t('earnings.trust.accent')}</span>
            </h3>
            <div className="grid gap-10">
              {TRUST_POINTS.map((point, i) => (
                <div key={i} className="flex gap-8 items-start group">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-brand-bg text-brand-secondary flex items-center justify-center group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all duration-300 shadow-xl border border-brand-border group-hover:rotate-6">
                    {point.icon}
                  </div>
                  <div>
                    <h5 className="text-2xl font-bold text-brand-secondary mb-2 tracking-tight">{point.title}</h5>
                    <p className="text-base text-brand-secondary/40 font-medium leading-relaxed">{point.desc}</p>
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
            className="bg-brand-secondary p-12 lg:p-16 rounded-[4rem] text-white overflow-hidden relative text-left"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient from-brand-primary/10 via-transparent to-transparent pointer-events-none" />
            
            <h3 className="text-4xl lg:text-5xl font-bold mb-12 tracking-tight relative z-10">
              {t('earnings.timeline.title')}{" "}
              <span className="text-brand-primary">{t('earnings.timeline.accent')}</span>
            </h3>
            
            <div className="relative space-y-14 z-10">
              {/* Vertical line */}
              <div className="absolute left-7 top-2 bottom-2 w-px bg-white/10" />
              
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex items-center gap-10 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[12px] font-medium text-brand-primary tracking-widest">{item.time}</span>
                       {i === TIMELINE.length - 1 && <span className="px-5 py-2 bg-brand-primary text-brand-secondary rounded-xl text-[10px] font-semibold tracking-widest animate-pulse shadow-2xl shadow-brand-primary/20">Protocol Live</span>}
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold leading-none tracking-tight">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 pt-12 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-secondary shrink-0 shadow-2xl">
                  <Globe size={28} className="animate-spin-slow" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-white/40 tracking-tight">
                  {t('earnings.timeline.footer')}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
