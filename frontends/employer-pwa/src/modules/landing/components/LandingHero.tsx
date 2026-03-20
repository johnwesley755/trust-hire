import { motion } from "framer-motion";
import { ArrowRight, Play, Star, ShieldCheck } from 'lucide-react';
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-brand-bg">
      {/* Background Decor */}
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
        
        {/* Content Column */}
        <div className="flex flex-col items-start text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-white/60 backdrop-blur-md border border-brand-border/30 rounded-2xl text-brand-muted text-[10px] font-bold tracking-tight mb-10 shadow-sm"
          >
            <span className="bg-brand-primary text-brand-secondary px-3 py-1 rounded-xl font-bold">Premium</span>
            <span>Enterprise Talent Cloud</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-brand-secondary mb-8 text-balance"
          >
            Scale Your <br/>
            <span className="text-brand-primary text-glow">Verified Fleet</span><br/>
            Instantly
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-muted/80 max-w-xl font-bold leading-tight mb-12 text-balance italic"
          >
            India's #1 Aadhaar-Verified workforce solution. 
            Eliminate operational risk with real-time verification and pre-screened professionals.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full sm:w-auto flex flex-col sm:flex-row gap-6 pt-4"
          >
              <Link
                to="/sign-up"
                className="px-10 py-5 bg-brand-secondary text-brand-primary rounded-2xl font-bold text-lg shadow-xl hover:bg-neutral-900 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                Start Hiring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-5 bg-white border border-brand-border rounded-2xl font-bold text-lg text-brand-secondary hover:bg-brand-bg transition-all shadow-lg flex items-center justify-center gap-3">
                 <Play className="w-4 h-4 fill-current" />
                 Watch Demo
              </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 pt-8 border-t border-brand-border/30 flex flex-wrap items-center gap-8"
          >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl border-4 border-brand-bg bg-white overflow-hidden shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                        <img src={`https://i.pravatar.cc/150?u=employer${i}`} alt="user" />
                    </div>
                ))}
              </div>
              <div>
                <div className="flex gap-1 text-brand-primary mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <div className="text-[10px] font-bold text-brand-muted capitalize tracking-widest">
                    Trusted by <span className="text-brand-secondary">25,000+ Enterprises</span>
                </div>
              </div>
          </motion.div>
        </div>

        {/* Media Composition Column */}
        <div className="relative w-full aspect-square flex justify-center items-center">
          
          <div className="absolute inset-0 bg-brand-primary/10 rounded-2xl rotate-6 scale-95 blur-3xl opacity-20" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -20, 0]
            }}
            transition={{
              duration: 1,
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            className="relative z-20 w-full max-w-xl aspect-[4/5] rounded-3xl overflow-hidden bg-white p-4 shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/50 backdrop-blur-xl"
          >
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-brand-secondary border border-white/20">
               <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover opacity-60"
               >
                  <source src="/assets/landing/worker-pwa.mp4" type="video/mp4" />
               </video>
               <div className="absolute inset-0 bg-linear-to-t from-brand-secondary via-transparent to-transparent flex flex-col justify-end p-10">
                   <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-0.5 bg-brand-primary rounded-full" />
                       <span className="text-[10px] font-bold text-brand-primary tracking-widest">Live Demo</span>
                   </div>
                   <h3 className="text-3xl font-bold text-white leading-tight tracking-tight mb-4">Command Your Workforce.</h3>
               </div>
            </div>
          </motion.div>

          {/* Floating Action Cards */}
          <motion.div
            animate={{ y: [15, -15, 15], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute -top-10 -left-6 sm:top-20 sm:-left-12 z-30 glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 shadow-xl border border-white/40"
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[10px] font-bold text-brand-muted capitalize tracking-widest opacity-50 mb-0.5 sm:mb-1">Risk Profile</div>
              <div className="text-sm sm:text-lg font-bold text-brand-secondary">0% Hazard</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [3, -3, 3] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -right-6 sm:bottom-20 sm:-right-12 z-30 glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 shadow-xl border border-white/40"
          >
             <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-brand-primary/20 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-brand-primary fill-current" />
             </div>
             <div>
                <div className="text-[8px] sm:text-[10px] font-bold text-brand-muted capitalize tracking-widest opacity-50 mb-0.5 sm:mb-1">Elite Talent</div>
                <div className="text-sm sm:text-lg font-bold text-brand-secondary">Level 4 Certified</div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
