import { Link } from "react-router-dom";
import { ArrowRight, Globe, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../../../core/hooks/useLanguage";

export function LandingCareerLevels() {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  
  const LEVELS = [
    {
      code: "L1",
      name: t('levels.l1.name'),
      desc: t('levels.l1.desc'),
      perks: [t('levels.perk.l1.1'), t('levels.perk.l1.2'), t('levels.perk.l1.3')],
      color: "bg-white border border-brand-border shadow-xl",
      accent: "text-brand-secondary",
      tag: null,
    },
    {
      code: "L2",
      name: t('levels.l2.name'),
      desc: t('levels.l2.desc'),
      perks: [t('levels.perk.l2.1'), t('levels.perk.l2.2'), t('levels.perk.l2.3')],
      color: "bg-brand-secondary text-brand-primary shadow-2xl",
      accent: "text-brand-primary",
      tag: t('levels.tag.popular'),
    },
    {
      code: "L3",
      name: t('levels.l3.name'),
      desc: t('levels.l3.desc'),
      perks: [t('levels.perk.l3.1'), t('levels.perk.l3.2'), t('levels.perk.l3.3')],
      color: "bg-brand-primary text-brand-secondary shadow-2xl",
      accent: "text-brand-secondary",
      tag: null,
    },
    {
      code: "L4",
      name: t('levels.l4.name'),
      desc: t('levels.l4.desc'),
      perks: [t('levels.perk.l4.1'), t('levels.perk.l4.2'), t('levels.perk.l4.3')],
      color: "bg-white border border-brand-border shadow-xl",
      accent: "text-brand-secondary",
      tag: t('levels.tag.top'),
    },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-60, 20]); 

  return (
    <section id="levels" ref={containerRef} className="py-32 bg-brand-bg relative overflow-hidden selection:bg-brand-primary selection:text-brand-secondary">
      {/* Background Decorative */}
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Master Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <span className="inline-flex items-center gap-3 px-6 py-3 bg-brand-secondary text-brand-primary rounded-full text-[11px] font-semibold tracking-tight mb-10 border border-brand-secondary/10 shadow-2xl">
              <Globe size={18} />
              {t('levels.badge')}
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-[100px] font-bold text-brand-secondary leading-[0.9] tracking-tight mb-10">
              {t('levels.title').split('career ladder.').map((text: string, i: number, arr: string[]) => (
                <span key={i}>
                  {text}{i < arr.length - 1 && (
                    <span className="relative text-brand-primary">
                      <span className="relative z-10">career ladder.</span>
                      <span className="absolute -bottom-2 left-0 right-0 h-4 bg-brand-secondary/5 z-0 rounded-lg" />
                    </span>
                  )}
                </span>
              ))}
            </h2>
            <p className="text-brand-secondary/40 text-xl font-medium leading-relaxed max-w-xl">
              {t('levels.desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-end relative group"
          >
            {/* Background Accent */}
            <div className="absolute right-10 bottom-0 w-80 h-80 bg-brand-secondary/5 rounded-[4rem] group-hover:rotate-12 transition-transform duration-700" />
            
            {/* Parallax Image */}
            <motion.img 
              style={{ y: imgY }}
              src="/assets/landing/worker-master.png"
              alt="Elite Level 4 Master Professional"
              className="relative z-10 h-[550px] object-contain drop-shadow-2xl origin-bottom brightness-110 group-hover:scale-105 transition-all duration-700"
            />
          </motion.div>
        </div>

        {/* Level cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LEVELS.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -15, transition: { duration: 0.4 } }}
              className={`relative rounded-[3rem] p-10 ${level.color} cursor-default overflow-hidden group border border-brand-border/50 text-left`}
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />
              
              {level.tag && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-brand-primary text-brand-secondary text-[10px] font-semibold px-5 py-2 rounded-full tracking-tight shadow-2xl border border-white/20 whitespace-nowrap">
                    {level.tag}
                  </span>
                </div>
              )}
              <div className="mb-8 relative z-10">
                <span className={`text-5xl font-semibold ${level.accent} opacity-40 group-hover:opacity-100 transition-opacity`}>{level.code}</span>
                <h3
                  className={`text-2xl font-bold mt-2 tracking-tight ${
                    level.color.includes("bg-brand-secondary") ? "text-brand-primary" : "text-brand-secondary"
                  }`}
                >
                  {level.name}
                </h3>
              </div>
              <p
                className={`text-base leading-relaxed mb-8 font-medium ${
                  level.color.includes("bg-brand-secondary") ? "text-white/60" : "text-brand-secondary/40"
                }`}
              >
                {level.desc}
              </p>
              <ul className="space-y-4 relative z-10">
                {level.perks.map((perk, j) => (
                  <li
                    key={j}
                    className={`text-[12px] font-semibold flex items-center gap-3 tracking-tight ${
                      level.color.includes("bg-brand-secondary") ? "text-white/80" : "text-brand-secondary/60"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 shadow-lg ${
                        level.color.includes("bg-brand-primary") ? "bg-brand-secondary shadow-brand-secondary/40" : "bg-brand-primary shadow-brand-primary/40"
                      }`}
                    />
                    {perk}
                  </li>
                ))}
              </ul>
              
              {/* Decorative corner icon */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.05] group-hover:opacity-10 transition-opacity text-brand-primary">
                 <Star size={100} className="fill-current" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-24 text-center"
        >
          <Link
            to="/sign-up"
            className="group inline-flex items-center gap-5 px-12 py-6 bg-brand-secondary hover:bg-neutral-800 text-brand-primary rounded-[2rem] font-semibold text-xl transition-all shadow-2xl shadow-brand-secondary/30 active:scale-95"
          >
            {t('levels.cta')}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
