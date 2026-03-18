import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import React, { useRef } from "react";
import { Zap, ShieldCheck, Target, Globe } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
  illustration: string;
  accent: string;
  textColor: string;
}

export function LandingBenefits() {
  const containerRef = useRef(null);
  const { t } = useLanguage();

  const translatedBenefits: Benefit[] = [
    {
      title: t('benefits.points.1.title'),
      description: t('benefits.points.1.desc'),
      icon: <Zap className="w-10 h-10" />,
      badge: t('benefits.points.1.badge'),
      color: "bg-white text-brand-secondary",
      illustration: "/assets/landing/trusthyre-worker.png",
      accent: "bg-brand-bg",
      textColor: "text-brand-secondary"
    },
    {
      title: t('benefits.points.2.title'),
      description: t('benefits.points.2.desc'),
      icon: <ShieldCheck className="w-10 h-10" />,
      badge: t('benefits.points.2.badge'),
      color: "bg-brand-secondary text-brand-primary",
      illustration: "/assets/landing/worker-master.png",
      accent: "bg-white/5",
      textColor: "text-brand-primary"
    },
    {
      title: t('benefits.points.3.title'),
      description: t('benefits.points.3.desc'),
      icon: <Target className="w-10 h-10" />,
      badge: t('benefits.points.3.badge'),
      color: "bg-brand-primary text-brand-secondary",
      illustration: "/assets/landing/success-worker.png",
      accent: "bg-black/5",
      textColor: "text-brand-secondary"
    }
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative bg-brand-bg py-20 lg:py-32 overflow-hidden selection:bg-brand-primary selection:text-brand-secondary"
      id="benefits"
    >
      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12 lg:mb-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-secondary text-brand-primary text-[11px] font-semibold tracking-tight mb-10 border border-brand-secondary shadow-2xl">
            <Globe size={18} className="animate-pulse" />
            <span>{t('benefits.badge')}</span>
          </div>
          <h2 className="text-6xl sm:text-8xl lg:text-[100px] font-bold text-brand-secondary leading-[0.9] tracking-tight mb-10">
            {t('benefits.title')}<br />
            <span className="text-brand-primary">{t('benefits.title.accent')}</span>
          </h2>
          <p className="text-xl sm:text-2xl text-brand-secondary/40 font-medium leading-relaxed max-w-2xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </motion.div>

        {/* Layered Stack (Deck of Cards) */}
        <div className="space-y-32 lg:space-y-0 relative">
          {translatedBenefits.map((benefit, index) => (
            <div key={index} className="lg:h-screen lg:sticky lg:top-0 flex items-center justify-center py-10 lg:py-0">
              <BenefitCard benefit={benefit} isFirst={index === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative ornaments */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}

function BenefitCard({ benefit, isFirst }: { benefit: Benefit, isFirst: boolean }) {
  const { t } = useLanguage();
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.005
  });

  const scale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.95, 1, 1, 0.95]);
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [2, 0, -2]);
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.9]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, rotate, opacity }}
      className={`relative w-full rounded-[4rem] sm:rounded-[6rem] p-10 sm:p-16 lg:p-24 shadow-[0_50px_100px_rgba(31,63,52,0.1)] overflow-hidden border border-brand-border group flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${benefit.color} will-change-transform transform-gpu`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      {/* Visual Content (Illustration) */}
      <div className="w-full lg:w-1/2 order-2 lg:order-1">
        <div className={`relative aspect-square rounded-[3rem] sm:rounded-[4.5rem] ${benefit.accent} flex items-center justify-center overflow-hidden p-10 sm:p-16 shadow-inner`}>
            {/* Inner background pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              src={benefit.illustration} 
              alt={benefit.title}
              loading={isFirst ? "eager" : "lazy"}
              className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105 brightness-105"
            />
        </div>
      </div>

      {/* Textual Content */}
      <div className={`w-full lg:w-1/2 order-1 lg:order-2 space-y-10 lg:space-y-14 text-left ${benefit.textColor}`}>
        <div className="flex items-center justify-between">
          <div className={`w-24 h-24 rounded-[2rem] ${benefit.color === 'bg-brand-secondary text-brand-primary' ? 'bg-white/10' : 'bg-brand-secondary/5'} backdrop-blur-3xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:rotate-6 transition-transform`}>
            <div className="group-hover:scale-110 transition-all duration-300">
               {benefit.icon}
            </div>
          </div>
          <motion.span 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className={`px-8 py-3 rounded-full ${benefit.color === 'bg-brand-secondary text-brand-primary' ? 'bg-white/10' : 'bg-brand-secondary/5'} text-[11px] font-semibold tracking-tight backdrop-blur-md border border-white/10`}
          >
            {benefit.badge}
          </motion.span>
        </div>

        <div className="space-y-8">
          <h3 className="text-6xl sm:text-7xl font-bold leading-[1] tracking-tight">
            {benefit.title}
          </h3>
          <p className="text-xl lg:text-2xl font-medium opacity-60 leading-snug tracking-tight max-w-xl">
            {benefit.description}
          </p>
        </div>

        {/* Feature Points */}
        <div className="flex flex-wrap gap-4">
           {[t('benefits.tags.1'), t('benefits.tags.2'), t('benefits.tags.3')].map((tag, i) => (
             <div key={i} className={`px-6 py-3 rounded-2xl ${benefit.color === 'bg-brand-secondary text-brand-primary' ? 'bg-white/10' : 'bg-brand-secondary/5'} text-[11px] font-semibold tracking-tight border border-white/5`}>{tag}</div>
           ))}
        </div>
      </div>

      {/* Premium Glossy Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/[0.05] to-transparent pointer-events-none" />
    </motion.div>
  );
}