import { motion } from "framer-motion";
import { Search, MapPin, Star, ShieldCheck, Zap } from "lucide-react";

export function LandingScoutingDemo() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0 cloud-grid pointer-events-none opacity-[0.03]" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
            {/* Left: Interactive Mockup UI */}
            <div className="w-full lg:w-3/5 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 lg:p-12 bg-white rounded-lg shadow-2xl relative z-10 border border-brand-border overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent rounded-lg pointer-events-none" />
                    
                    {/* Mock Search Header */}
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <Search className="text-brand-secondary w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-1">Live Map</div>
                                <div className="text-xl font-bold text-brand-secondary leading-none">Find Workers Near You</div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Interaction Area */}
                    <div className="p-5 bg-brand-surface rounded-lg border border-brand-border flex items-center gap-4 mb-8">
                        <MapPin className="text-brand-primary w-5 h-5 animate-bounce" />
                        <span className="text-brand-secondary font-bold text-lg">Within 5km</span>
                        <div className="ml-auto flex gap-2">
                        </div>
                    </div>

                    {/* Talent List (Visual-First) */}
                    <div className="space-y-4">
                        {[
                            { name: "Karan J.", role: "Supervisor", skill: "Expert", score: 99 },
                            { name: "Priya S.", role: "Electrician", skill: "Top Rated", score: 98 },
                            { name: "Aman G.", role: "Specialist", skill: "Verified", score: 97 }
                        ].map((talent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6 group hover:bg-white/10 transition-all"
                            >
                                <div className="w-16 h-16 bg-brand-surface rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                    <div className="w-full h-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-secondary text-2xl">
                                        {talent.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-bold text-xl">{talent.name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="px-2 py-0.5 bg-brand-primary/20 text-brand-primary text-[10px] font-bold rounded uppercase tracking-tighter">
                                            {talent.role}
                                        </div>
                                        <div className="flex text-emerald-400">
                                            {[1,2,3].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-brand-primary font-bold text-2xl tracking-tighter">%{talent.score}</div>
                                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Trust</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right: Copy */}
            <div className="w-full lg:w-2/5 space-y-12">
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-16 h-1 bg-brand-primary rounded-full" 
                    />
                    <h2 className="text-5xl lg:text-8xl font-extrabold tracking-tight leading-[0.85]">
                        Find Them <br />
                        <span className="text-brand-primary">Nearby.</span>
                    </h2>
                    <p className="text-xl text-brand-muted font-bold leading-relaxed">
                        Find workers within 5 minutes. No waiting. No travel costs. 
                        Instant hiring at your fingertips.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {[
                        { title: "Fast Hire", desc: "Start work today", icon: Zap, color: "text-amber-500" },
                        { title: "Safe Choice", desc: "Aadhaar verified ID", icon: ShieldCheck, color: "text-emerald-500" },
                        { title: "Top Talent", desc: "Certified L1-L4 skill", icon: Star, color: "text-brand-primary" }
                    ].map((feat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-6 group"
                        >
                            <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center shrink-0 border border-brand-border shadow-sm group-hover:scale-110 transition-transform">
                                <feat.icon className={`w-8 h-8 ${feat.color}`} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-brand-secondary">{feat.title}</h4>
                                <p className="text-brand-muted font-bold italic">{feat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full py-6 bg-brand-secondary text-brand-primary rounded-lg font-bold text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Search Near You
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}
