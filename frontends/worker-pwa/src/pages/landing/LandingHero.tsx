import { Link } from "react-router-dom";
import { ArrowRight, Play, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export function LandingHero() {

  return (
    <section className="sticky top-0 z-0 w-full overflow-hidden bg-[#f5f4ef] pt-28 lg:pt-32 pb-12 min-h-[100svh] flex flex-col justify-center">
      
      {/* ── Decorative Background Elements ── */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-[#1d4744]/5 to-transparent z-0 pointer-events-none" />
      
      {/* ── Animated Dual-Image Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Left Side: Construction Animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [-1, 1, -1],
            x: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-10%] top-[10%] w-[60%] h-[120%] opacity-50 origin-bottom-left"
        >
          <img
            src="/assets/landing/hero-construction.png"
            alt="Construction background"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Right Side: Chef Animation */}
        <motion.div
          animate={{ 
            scale: [1.05, 1, 1.05],
            rotate: [1, -1, 1],
            y: [0, -15, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-5%] top-[5%] w-[60%] h-[120%] opacity-50 origin-bottom-right"
        >
          <img
            src="/assets/landing/hero-professional.png"
            alt="Chef background"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Light Overlay to keep it subtle and light-themed */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f4ef]/60 via-[#f5f4ef]/40 to-[#f5f4ef] pointer-events-none" />
        
        {/* Animated floating diamonds */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [45, 90, 45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-[15%] w-6 h-6 bg-[#f0b429] opacity-80 rounded-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [45, 0, 45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-64 right-[12%] w-4 h-4 bg-[#1d4744] opacity-60 rounded-sm"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col items-center">
        
        {/* ── TOP: Centered Headline & Content ── */}
        <div className="text-center max-w-4xl mx-auto space-y-8 mb-4 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d4744]/10 text-[#1d4744] rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest border border-[#1d4744]/20 mb-6">
              <span className="text-lg leading-none">🇮🇳</span> India's #1 Verified Professionals Network
            </div>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] font-black text-[#111] leading-[1.0] tracking-tighter">
              Find skilled{" "}
              <span className="relative inline-block mx-4">
                <span className="relative z-10 text-white px-6 py-2">work</span>
                <span className="absolute inset-0 bg-[#f0b429] rounded-xl -rotate-2 z-0 shadow-sm" />
              </span>
              <br className="hidden sm:block" />
              that pays <span className="text-[#1d4744]">more.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl text-[#555] max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Join India's most trusted network of verified workers. Get premium
            jobs, instant payouts, and build your professional reputation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-center gap-5 pt-2"
          >
            <Link
              to="/sign-up"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#1d4744] hover:bg-[#2a5f5b] text-white rounded-2xl font-bold text-lg transition-all hover:shadow-[0_8px_30px_rgba(29,71,68,0.35)] hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center justify-center gap-3 px-8 py-4 text-[#111] bg-white border-2 border-[#111]/10 rounded-2xl font-bold text-lg hover:border-[#1d4744] hover:text-[#1d4744] transition-all hover:-translate-y-1 shadow-sm">
              <Play className="w-5 h-5 fill-current" />
              Watch Video
            </button>
          </motion.div>
          
          {/* Trust stats below buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-x-10 gap-y-4 pt-4"
          >
            {[
              { icon: <Users className="w-5 h-5 text-[#f0b429]" />, value: "50k+", label: "Verified Workers" },
              { icon: <TrendingUp className="w-5 h-5 text-[#f0b429]" />, value: "₹2,450", label: "Avg Daily Earnings" },
              { icon: <ShieldCheck className="w-5 h-5 text-[#f0b429]" />, value: "4.9★", label: "Platform Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-[#111] leading-none mb-1">{stat.value}</p>
                  <p className="text-xs text-[#777] font-semibold uppercase tracking-wide">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>



      </div>
    </section>
  );
}
