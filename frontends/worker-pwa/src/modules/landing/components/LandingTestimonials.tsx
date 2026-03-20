import { motion } from "framer-motion";
import { Star, Quote, Globe } from "lucide-react";
import { useLanguage } from "../../../core/hooks/useLanguage";  

export function LandingTestimonials() {
  const { t } = useLanguage();

  const TESTIMONIALS = [
    {
      name: t('testimonials.1.name'),
      role: t('testimonials.1.role'),
      location: t('testimonials.1.location'),
      quote: t('testimonials.1.quote'),
      rating: 5,
      image: "https://i.pravatar.cc/150?u=rajesh",
    },
    {
      name: t('testimonials.2.name'),
      role: t('testimonials.2.role'),
      location: t('testimonials.2.location'),
      quote: t('testimonials.2.quote'),
      rating: 5,
      image: "https://i.pravatar.cc/150?u=anita",
    },
    {
      name: t('testimonials.3.name'),
      role: t('testimonials.3.role'),
      location: t('testimonials.3.location'),
      quote: t('testimonials.3.quote'),
      rating: 5,
      image: "https://i.pravatar.cc/150?u=vikram",
    },
  ];

  return (
    <section className="py-32 bg-brand-secondary text-white relative overflow-hidden selection:bg-brand-primary selection:text-brand-secondary">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 5px 5px, rgba(255,255,255,0.8) 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      {/* AMBER MIXED IN GREEN BG */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24 px-4"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-brand-primary text-[11px] font-semibold tracking-tight mb-10 shadow-2xl">
            <Globe size={18} className="text-brand-primary animate-pulse" />
            <span>{t('testimonials.badge')}</span>
          </div>
          <h2 className="text-6xl sm:text-8xl lg:text-[100px] font-bold leading-[0.9] tracking-tight mb-10">
            {t('testimonials.title')} <br />
            <span className="text-brand-primary opacity-90">{t('testimonials.accent')}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-12 border border-white/10 flex flex-col relative group hover:bg-white/10 transition-all duration-500 shadow-2xl"
            >
              <Quote className="absolute top-10 right-10 w-16 h-16 text-brand-primary/10 group-hover:scale-110 transition-transform" />
              
              <div className="flex gap-2 mb-10">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-primary text-brand-primary shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
                ))}
              </div>
              
              <p className="text-white/80 text-xl font-medium leading-relaxed mb-12 grow">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-6 mt-auto">
                <div className="relative">
                    <img 
                    src={t.image} 
                    alt={t.name}
                    className="w-16 h-16 rounded-3xl border-2 border-brand-primary object-cover shadow-2xl brightness-110 group-hover:scale-105 transition-all"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-brand-primary w-7 h-7 rounded-xl flex items-center justify-center shadow-lg border-2 border-brand-secondary">
                        <Star className="w-4 h-4 text-brand-secondary fill-current" />
                    </div>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white tracking-tight text-xl">{t.name}</h4>
                  <p className="text-brand-primary text-xs font-semibold tracking-tight">{t.role} <span className="text-white/40 font-semibold ml-2">Â· {t.location}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
