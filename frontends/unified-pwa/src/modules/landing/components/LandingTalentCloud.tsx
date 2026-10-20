import { motion } from "framer-motion";
import { Star, TrendingUp, Award } from "lucide-react";

const LEVELS = [
    { lv: "Lead", title: "Lead Master", desc: "Project Leaders & Supervisors", color: "bg-brand-primary" },
    { lv: "Expert", title: "Senior Expert", desc: "Top Performance Specialists", color: "bg-brand-secondary" },
    { lv: "Pro", title: "Verified Pro", desc: "Proven Quality Execution", color: "bg-blue-600" },
    { lv: "Ready", title: "Foundational", desc: "Identity & Background Verified", color: "bg-slate-700" }
];

export function LandingTalentCloud() {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden flex items-center min-h-[80vh]">
       {/* Background Decor */}
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          {/* Content */}
          <div className="w-full lg:w-1/2 space-y-16 text-left">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                className="w-24 h-2 bg-brand-primary rounded-full origin-left opacity-30"
              />
              <h2 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                Enterprise <br />
                <span className="text-brand-primary text-glow">Standards</span>
              </h2>
              <p className="text-xl text-brand-muted/80 font-semibold leading-relaxed max-w-xl">
                Our multi-tier skill architecture gives you a standardized way to measure and scale your workforce with zero ambiguity.
              </p>
            </div>

            {/* Level Ladder */}
            <div className="grid grid-cols-1 gap-6">
              {LEVELS.map((level, i) => (
                <motion.div
                    key={level.title}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 group bg-white p-5 rounded-2xl border border-brand-border/30 shadow-lg hover:border-brand-primary/50 transition-all cursor-pointer"
                >
                    <div className={`w-16 h-16 ${level.color} rounded-2xl flex items-center justify-center font-bold text-white text-xs uppercase shadow-lg transition-transform group-hover:scale-105`}>
                        {level.lv}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-2xl font-bold text-brand-secondary tracking-tight">{level.title}</h4>
                            <div className="flex text-amber-500">
                                {[...Array(4-i)].map((_, s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                            </div>
                        </div>
                        <p className="text-brand-muted font-semibold text-base">{level.desc}</p>
                    </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visualization */}
          <div className="w-full lg:w-1/2 relative group">
                <div className="absolute -inset-10 bg-brand-primary/5 rounded-full blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl overflow-hidden border-8 border-white shadow-xl aspect-square relative z-10"
                >
                    <img 
                        src="/images/indi_group.png" 
                        alt="Quality Teams" 
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-secondary/40 to-transparent" />
                </motion.div>

                {/* Efficiency Badge */}
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute -bottom-8 -right-8 p-10 bg-brand-secondary rounded-2xl shadow-2xl z-20 border border-white/10"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="text-brand-secondary w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold capitalize tracking-widest text-brand-primary mb-2">Utilization Rate</div>
                            <div className="text-4xl font-bold text-white tracking-tight">+40%</div>
                        </div>
                    </div>
                </motion.div>

                {/* Status Overlay */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="absolute top-8 left-8 py-3 px-6 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center gap-4 border border-white/50 z-20"
                >
                    <Award className="w-6 h-6 text-brand-primary" />
                    <span className="font-bold text-brand-secondary tracking-tight text-xs">Master Standardized</span>
                </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
