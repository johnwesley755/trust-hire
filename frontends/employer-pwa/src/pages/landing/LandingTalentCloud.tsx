import { motion } from "framer-motion";
import { Star, TrendingUp, Award } from "lucide-react";

const LEVELS = [
    { lv: "L4", title: "Expert", desc: "Project Leaders", color: "bg-brand-primary" },
    { lv: "L3", title: "Specialist", desc: "Top Performance", color: "bg-brand-secondary" },
    { lv: "L2", title: "Verified", desc: "Proven Quality", color: "bg-brand-muted" },
    { lv: "L1", title: "Ready", desc: "Aadhaar-Verified", color: "bg-slate-200" }
];

export function LandingTalentCloud() {
  return (
    <section className="py-32 bg-white relative overflow-hidden flex items-center min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left: Content */}
          <div className="w-full lg:w-1/2 space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="w-16 h-1 bg-brand-primary rounded-full"
              />
              <h2 className="text-5xl lg:text-8xl font-extrabold tracking-tight leading-[0.85]">
                Standardized <br />
                <span className="text-brand-primary text-glow">Quality.</span>
              </h2>
              <p className="text-xl text-brand-muted font-bold leading-relaxed max-w-lg">
                Scale your fleet with predictable quality. Our L1-L4 system ensures you hire exactly what you need.
              </p>
            </div>

            {/* Visual Level Ladder */}
            <div className="space-y-4">
              {LEVELS.map((level, i) => (
                <motion.div
                    key={level.lv}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 group"
                >
                    <div className={`w-20 h-14 ${level.color} rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg transition-transform group-hover:scale-110`}>
                        {level.lv}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-2xl font-bold text-brand-secondary">{level.title}</h4>
                            <div className="flex text-emerald-500">
                                {[...Array(4-i)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                        </div>
                        <p className="text-brand-muted font-bold italic">{level.desc}</p>
                    </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Visual Proof */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative group">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="rounded-lg overflow-hidden border-8 border-brand-bg shadow-2xl aspect-square"
                >
                    <img 
                        src="/images/indi_group.png" 
                        alt="Quality Teams" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-brand-secondary/20 group-hover:bg-transparent transition-all" />
                </motion.div>

                {/* Performance Badge */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="absolute -bottom-10 -right-10 p-10 bg-brand-secondary rounded-lg shadow-2xl z-20"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg">
                            <TrendingUp className="text-brand-secondary w-10 h-10" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-2">Efficiency Boost</div>
                            <div className="text-4xl font-extrabold text-white leading-none tracking-tight">+40%</div>
                        </div>
                    </div>
                </motion.div>

                {/* Level Tag Overlay */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="absolute top-10 left-10 py-3 px-6 bg-white rounded-full shadow-2xl flex items-center gap-4 border border-brand-border"
                >
                    <Award className="w-6 h-6 text-brand-primary" />
                    <span className="font-bold text-brand-secondary uppercase tracking-widest text-xs">Certified L4 Fleet</span>
                </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
