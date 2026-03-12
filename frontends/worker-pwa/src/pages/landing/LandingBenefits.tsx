import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import React, { useRef } from "react";
import { Zap, ShieldCheck, Target, Sparkles } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
  illustration: string;
  accent: string;
}

const benefits: Benefit[] = [
  {
    title: "Premium Earnings",
    description: "Verified pros earn up to 40% more than market rates. No middlemen, no hidden cuts. Get paid what you're actually worth, directly to your bank.",
    icon: <Zap className="w-10 h-10" />,
    badge: "UP TO 40% MORE",
    color: "bg-[#f9f8f4] text-brand-teal",
    illustration: "/assets/landing/trusthyre-worker.png",
    accent: "bg-brand-amber/10"
  },
  {
    title: "Reputation Score",
    description: "Each job builds your verified work history on the blockchain. Higher ratings unlock bigger corporate contracts and priority matching.",
    icon: <ShieldCheck className="w-10 h-10" />,
    badge: "BLOCKCHAIN SECURED",
    color: "bg-brand-teal text-white",
    illustration: "/assets/landing/worker-master.png",
    accent: "bg-white/10"
  },
  {
    title: "Smart Job Matching",
    description: "Our AI engine finds jobs that match your exact skills and location. No more searching, just notified and apply with one tap.",
    icon: <Target className="w-10 h-10" />,
    badge: "AI-POWERED MATCH",
    color: "bg-brand-amber text-brand-teal",
    illustration: "/assets/landing/success-worker.png",
    accent: "bg-black/10"
  }
];

export function LandingBenefits() {
  const containerRef = useRef(null);

  return (
    <section 
      ref={containerRef} 
      className="relative bg-white py-20 lg:py-32"
      id="benefits"
    >
      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        {/* Centered Header - No Sidebar to avoid whitespace */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 text-brand-amber text-xs font-black uppercase tracking-[0.3em] mb-8">
            <Sparkles size={16} className="animate-pulse" />
            <span>The TrustHire Advantage</span>
          </div>
          <h2 className="text-6xl sm:text-7xl lg:text-[100px] font-black text-brand-teal leading-[0.9] tracking-tighter mb-8">
            Better Jobs.<br />
            <span className="text-brand-amber">Better Life.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-brand-muted font-medium leading-relaxed max-w-2xl mx-auto">
            Experience the next generation of professional field work. Full transparency, instant payouts, and a career path that belongs to you.
          </p>
        </motion.div>

        {/* Layered Stack (Deck of Cards) */}
        <div className="space-y-32 lg:space-y-0 relative">
          {benefits.map((benefit, index) => (
            <div key={index} className="lg:h-screen lg:sticky lg:top-0 flex items-center justify-center py-10 lg:py-0">
              <BenefitCard benefit={benefit} isFirst={index === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative ornaments that fill the background */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-cream/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-brand-amber/5 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}

function BenefitCard({ benefit, isFirst }: { benefit: Benefit, isFirst: boolean }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Simplified spring for better performance (less CPU intensive)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.005
  });

  // Scale and rotation for the "Deck of Cards" effect
  const scale = useTransform(smoothProgress, [0, 0.4, 0.6, 1], [0.9, 1, 1, 0.9]);
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [1, 0, -1]);
  const opacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0.7, 1, 1, 0.8]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, rotate, opacity }}
      className={`relative w-full rounded-[48px] sm:rounded-[80px] p-8 sm:p-14 lg:p-20 shadow-[0_30px_90px_rgba(0,0,0,0.06)] overflow-hidden border border-black/5 group flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${benefit.color} will-change-transform transform-gpu`}
    >
      {/* Visual Content (Illustration) */}
      <div className="w-full lg:w-1/2 order-2 lg:order-1">
        <div className={`relative aspect-4/3 sm:aspect-square rounded-[40px] sm:rounded-[60px] ${benefit.accent} flex items-center justify-center overflow-hidden p-8 sm:p-12`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
              src={benefit.illustration} 
              alt={benefit.title}
              // Performance optimizations for LCP
              loading={isFirst ? "eager" : "lazy"}
              fetchPriority={isFirst ? "high" : "auto"}
              className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105"
            />
        </div>
      </div>

      {/* Textual Content */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2 space-y-8 lg:space-y-10">
        <div className="flex items-center justify-between">
          <div className="w-20 h-20 rounded-[28px] bg-white/20 backdrop-blur-2xl flex items-center justify-center shadow-xl ring-1 ring-black/5">
            <div className="group-hover:scale-110 transition-all duration-300">
               {benefit.icon}
            </div>
          </div>
          <motion.span 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             className="px-6 py-2.5 rounded-full bg-black/5 text-[11px] font-black tracking-[0.2em] uppercase backdrop-blur-md border border-white/10"
          >
            {benefit.badge}
          </motion.span>
        </div>

        <div className="space-y-6">
          <h3 className="text-5xl sm:text-6xl font-black leading-none tracking-tighter">
            {benefit.title}
          </h3>
          <p className="text-xl lg:text-2xl font-medium opacity-80 leading-snug tracking-tight max-w-xl">
            {benefit.description}
          </p>
        </div>

        {/* Feature Points */}
        <div className="flex flex-wrap gap-3">
           {["Direct Bank Payout", "Zero Commission", "24/7 Support"].map((tag, i) => (
             <div key={i} className="px-5 py-2.5 rounded-xl bg-black/5 text-[10px] font-bold uppercase tracking-[0.15em]">{tag}</div>
           ))}
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}