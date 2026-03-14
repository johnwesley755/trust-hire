import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap, TrendingUp } from "lucide-react";

// Correct path to assets in public directory
const HERO_ILLUSTRATION = "/images/indi_electrician.png";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white min-h-[90vh] flex items-center">
      {/* Background Oriented Pattern */}
      <div className="absolute inset-0 cloud-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3/4 h-full oriented-rays pointer-events-none opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 relative z-10 w-full">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-primary/15 border border-brand-primary/20 px-4 py-2 rounded-full shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-black text-brand-secondary">Blockchain-Verified Talent Pool</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black text-brand-secondary leading-[1.05] tracking-tighter"
          >
            Hire with <br />
            <span className="text-brand-primary relative inline-block">
                Absolute Trust.
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-4 bg-brand-primary/20 -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </span> <br />
            Scale Faster.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-muted max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed"
          >
            TrustHire bridges the gap between top Indian professionals and global enterprises through a secure, blockchain-verified ecosystem. Find, verify, and deploy in clicks.
          </motion.p>

          {/* Search Mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative flex items-center p-2 bg-white rounded-3xl shadow-2xl border border-brand-border group hover:border-brand-primary transition-all duration-300"
          >
            <div className="flex-1 flex items-center gap-3 px-4 text-left">
              <Search className="text-brand-muted w-6 h-6" />
              <div className="flex flex-col flex-1">
                <span className="text-[10px] uppercase font-black text-brand-muted">Search Skilled Talent</span>
                <input
                    type="text"
                    placeholder="Electrician, Supervisor, Engineer..."
                    className="w-full outline-none text-brand-text font-black text-lg bg-transparent border-none placeholder:text-brand-muted/40"
                />
              </div>
            </div>
            <div className="w-px h-10 bg-brand-border" />
            <Link
              to="/sign-up"
              className="bg-brand-secondary text-brand-primary p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
            >
              <Search className="w-7 h-7 stroke-[3px]" />
            </Link>
          </motion.div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary">
                    <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                    <div className="text-xs font-black text-brand-secondary uppercase">Instant Match</div>
                    <div className="text-[10px] font-bold text-brand-muted">AI-Powered Scoring</div>
                </div>
            </div>
            <div className="w-px h-10 bg-brand-border hidden sm:block" />
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-surface rounded-xl flex items-center justify-center text-brand-accent">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <div className="text-xs font-black text-brand-secondary uppercase">Scalable Fleet</div>
                    <div className="text-[10px] font-bold text-brand-muted">Verified History</div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Content - Full Width Illustration Integration */}
        <div className="w-full lg:w-1/2 relative min-h-[500px] flex items-center justify-center">
            <motion.div 
                className="relative z-10 w-full"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <img 
                    src={HERO_ILLUSTRATION} 
                    alt="Indian Professional Electrician" 
                    className="w-full h-auto drop-shadow-[0_80px_100px_rgba(250,204,21,0.3)] animate-float rounded-full border-[12px] border-white/40 backdrop-blur-sm"
                />
            </motion.div>

            {/* Floating Talent Card */}
            <motion.div
                className="absolute top-10 right-0 p-5 glass-card rounded-[32px] z-20 w-72 translate-x-12 hidden md:block border-2 border-brand-primary/20"
                animate={{ y: [0, -25, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-brand-secondary font-black overflow-hidden border-2 border-white shadow-md">
                        <img src="/images/indi_electrician.png" alt="Arjun V." className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-black text-brand-secondary text-base">Arjun Varma</h4>
                        <div className="flex items-center gap-1 text-[10px] text-brand-muted font-bold">
                            <span className="text-brand-accent font-black tracking-tighter">MASTER ELECTRICIAN</span>
                        </div>
                    </div>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-black text-brand-muted uppercase">Trust Score</div>
                        <div className="text-lg font-black text-brand-primary">99.8%</div>
                    </div>
                    <div className="px-4 py-2 bg-brand-secondary text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-tight shadow-lg">Verified</div>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
