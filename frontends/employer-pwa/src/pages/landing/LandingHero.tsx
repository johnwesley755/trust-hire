import { motion } from "framer-motion";
import { ArrowRight, Play, Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-brand-surface">
      {/* 3D-like Soft Lighting Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left">
          
          {/* Launch Special Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-brand-border/50 rounded-full text-brand-muted text-[10px] font-bold tracking-widest uppercase mb-8 shadow-sm"
          >
            <span className="bg-brand-primary text-brand-secondary px-2 py-0.5 rounded-full font-bold">Verified Fleet</span>
            <span>Aadhaar-Verified Talent</span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-brand-secondary mb-6 text-balance"
          >
            Secure Your <br/>
            <span className="text-brand-primary">Verified Fleet</span><br/>
            in Seconds.
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-muted max-w-lg font-medium leading-relaxed mb-10 text-balance"
          >
            India's #1 Aadhaar-Verified talent cloud. 
            Eliminate risk, automate background checks, and scale your operations with total peace of mind.
          </motion.p>

          {/* Pill CTA Input-like styling */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full sm:w-auto"
          >
            <div className="flex items-center bg-white p-2 rounded-full border border-brand-border/40 shadow-xl shadow-brand-primary/5 max-w-md w-full">
              <div className="flex items-center px-4 gap-2 text-brand-muted font-medium w-full truncate">
                <ShieldCheck className="w-5 h-5 text-brand-primary shrink-0" />
                <span className="truncate">Ready to scale your workforce?</span>
              </div>
              <Link
                to="/sign-up"
                className="shrink-0 px-6 py-3 bg-brand-primary text-brand-secondary rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Start Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?u=employer${i}`} alt="user" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex gap-0.5 text-brand-primary">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <div className="text-[10px] font-bold text-brand-muted">
                Trusted by 15,000+ Leaders
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Floating 3D/Media Composition */}
        <div className="relative w-full h-full min-h-[500px] flex justify-center items-center">
          
          {/* Main Video Layer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: 0, 
              rotateX: 0,
              y: [-10, 10, -10]
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            className="relative z-20 w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden bg-white p-3 shadow-2xl shadow-brand-primary/20 border border-white/60 backdrop-blur-sm"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-black">
              <video 
                src="/assets/landing/worker-pwa.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between">
                  <div className="text-left">
                      <div className="text-brand-primary font-bold uppercase tracking-widest text-[10px] mb-1">Live Worker Demo</div>
                      <div className="text-lg font-extrabold text-white leading-tight">TrustHire App</div>
                  </div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Play className="text-white fill-white w-4 h-4 ml-0.5" />
                  </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 1 - Stats */}
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute top-[10%] -left-8 z-30 bg-white p-4 rounded-2xl shadow-xl border border-brand-border/30 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-muted uppercase">Verification</div>
              <div className="text-sm font-extrabold text-brand-secondary">100% Aadhaar</div>
            </div>
          </motion.div>

          {/* Floating Element 2 - Profile App */}
          <motion.div
            animate={{ y: [-15, 15, -15], rotate: [2, -2, 2] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[10%] -right-4 z-30 bg-white p-3 rounded-2xl shadow-2xl border border-brand-border/30 flex items-center gap-4 backdrop-blur-md max-w-[200px]"
          >
             <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-brand-border/50">
                <img src="/assets/landing/hero-professional.png" alt="Worker" className="w-full h-full object-cover" />
             </div>
             <div>
                <div className="text-sm font-bold text-brand-secondary line-clamp-1">Rahul S.</div>
                <div className="text-[10px] text-brand-muted font-medium">Electrician • 4.9★</div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
