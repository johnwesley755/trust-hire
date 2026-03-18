import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Zap, CheckCircle,Lock } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export function LandingTrust() {
  const { t } = useLanguage();

  const securityFeatures = [
    { title: t('trust.feature.1.title'), desc: t('trust.feature.1.desc'), icon: <ShieldAlert className="w-6 h-6" /> },
    { title: t('trust.feature.2.title'), desc: t('trust.feature.2.desc'), icon: <Zap className="w-6 h-6" /> },
    { title: t('trust.feature.3.title'), desc: t('trust.feature.3.desc'), icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <section className="py-32 bg-brand-bg relative overflow-hidden selection:bg-brand-primary selection:text-brand-secondary">
      {/* ── Background Decorative ── */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-[120px] -mr-40" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <span className="inline-flex items-center gap-3 px-6 py-3 bg-brand-secondary text-brand-primary rounded-full text-[11px] font-semibold tracking-tight mb-10 border border-brand-secondary/10 shadow-2xl">
              <Lock size={16} className="animate-pulse" />
              {t('trust.badge')}
            </span>
            <h2 className="text-6xl md:text-7xl lg:text-[100px] font-bold text-brand-secondary leading-[0.9] tracking-tight mb-10">
              {t('trust.title')} <br />
              <span className="text-brand-primary inline-block relative">
                {t('trust.title.accent')}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-1 left-0 w-full h-4 bg-brand-secondary/5 -z-10 origin-left"
                />
              </span>
            </h2>
            <p className="text-brand-secondary/40 text-xl md:text-2xl font-medium leading-relaxed mb-14 max-w-xl">
              {t('trust.desc')}
            </p>

            <div className="space-y-8">
              {securityFeatures.map((feature, i) => (
                <div key={i} className="flex gap-8 items-center p-8 rounded-[3rem] bg-white border border-brand-border hover:bg-brand-secondary group transition-all duration-500 shadow-xl shadow-brand-secondary/5">
                  <div className="w-18 h-18 rounded-3xl bg-brand-bg shadow-inner flex items-center justify-center text-brand-secondary group-hover:bg-white group-hover:text-brand-secondary transition-all duration-300 transform group-hover:-rotate-6">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-secondary text-2xl mb-2 tracking-tight group-hover:text-white transition-colors">{feature.title}</h4>
                    <p className="text-brand-secondary/40 text-base font-medium group-hover:text-white/60 transition-colors">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Privacy Animation */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 bg-brand-secondary rounded-[4rem] lg:rounded-[5rem] p-12 sm:p-16 lg:p-24 shadow-[0_80px_160px_rgba(31,63,52,0.25)] border-[1px] border-white/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-radial-gradient from-brand-primary/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-0 right-0 p-12">
                <ShieldCheck className="w-12 h-12 sm:w-16 sm:h-16 text-brand-primary opacity-20" />
              </div>
              
              <div className="space-y-16 lg:space-y-20 text-left relative z-10">
                <div className="space-y-6">
                  <p className="text-brand-primary font-semibold text-xs tracking-widest leading-none">{t('trust.visual.input')}</p>
                  <div className="bg-white/5 border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-inner backdrop-blur-3xl">
                    <p className="text-white font-mono text-2xl sm:text-3xl tracking-[0.4em] opacity-80">1234 5678 9012</p>
                  </div>
                </div>
 
                <div className="flex justify-center">
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brand-primary/20 flex items-center justify-center shadow-2xl"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-brand-primary rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                  </motion.div>
                </div>
 
                <div className="space-y-6">
                  <p className="text-brand-primary font-semibold text-xs tracking-widest leading-none">{t('trust.visual.stored')}</p>
                  <div className="bg-white/5 border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-inner backdrop-blur-3xl">
                    <p className="text-brand-primary/40 font-mono text-[11px] sm:text-[13px] break-all opacity-80 leading-relaxed font-semibold">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855...
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating Shield Badge */}
              <div className="absolute -bottom-10 -right-6 bg-brand-primary p-8 rounded-[3rem] shadow-3xl rotate-12 border-[8px] border-white group-hover:rotate-0 transition-transform duration-500">
                 <ShieldCheck className="w-14 h-14 text-brand-secondary" />
              </div>
            </motion.div>

            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
