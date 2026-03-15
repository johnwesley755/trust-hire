import { motion } from "framer-motion";
import { ArrowRight, Shield, ShieldCheck } from 'lucide-react';
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Background patterns */}
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 right-0 w-2/3 h-full bg-linear-to-l from-brand-primary/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary text-xs font-black tracking-widest uppercase"
          >
            <Shield className="w-4 h-4" />
            Blockchain-Verified Talent Infrastructure
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-brand-secondary"
            >
              Secure Your <br />
              <span className="text-brand-primary">Verified Fleet</span> <br />
              in Seconds.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-brand-muted max-w-lg font-bold leading-relaxed"
            >
              TrustHire is India's leading enterprise talent cloud. We use AI and blockchain 
              to provide 100% verified professionals for your critical operations.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6"
          >
            <Link
              to="/sign-up"
              className="px-12 py-6 bg-brand-secondary text-brand-primary rounded-2xl font-black text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              Start Scouting
              <ArrowRight className="w-6 h-6" />
            </Link>
            <div className="flex -space-x-4 items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="pl-8 text-sm font-black text-brand-secondary">
                <div className="text-brand-primary">15,000+</div>
                Partner Companies
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 rounded-[80px] overflow-hidden border-8 border-white shadow-2xl bg-brand-surface group"
          >
            <img 
              src="/images/indi_electrician.png" 
              alt="Professional Indian Workforce" 
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Real-time verification badge */}
            <motion.div 
                className="absolute top-10 right-10 p-6 glass-card rounded-3xl z-20 border-2 border-emerald-500/20 shadow-2xl"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-brand-secondary tracking-widest uppercase">Verified Sync</span>
                </div>
                <div className="text-2xl font-black text-brand-secondary">On-Chain ID</div>
            </motion.div>
          </motion.div>

          {/* Floating Feature Card */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 p-8 bg-brand-primary rounded-[40px] shadow-2xl z-20 hidden lg:block"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Rate</div>
                <div className="text-3xl font-black">99.2%</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
