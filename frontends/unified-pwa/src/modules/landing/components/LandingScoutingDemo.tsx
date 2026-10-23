import { motion } from "framer-motion";
import { Search, MapPin, Star, ShieldCheck, Zap } from "lucide-react";

export function LandingScoutingDemo() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 cloud-grid pointer-events-none opacity-[0.03]" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-32 items-center">
            {/* Mockup UI */}
            <div className="w-full lg:w-3/5 relative">
                <div className="absolute -inset-4 bg-brand-primary/5 rounded-[3rem] blur-3xl opacity-50" />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.05)] relative z-10 border border-brand-border/40 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-brand-secondary rounded-2xl flex items-center justify-center shadow-xl">
                                <Search className="text-brand-primary w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-brand-secondary leading-none tracking-tight">Enterprise Search</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="p-6 bg-brand-bg rounded-2xl border border-brand-border/50 flex items-center gap-4 mb-10 shadow-inner">
                        <MapPin className="text-brand-primary w-6 h-6 animate-bounce" />
                        <span className="text-brand-secondary font-bold text-lg tracking-tight">Active Radius: 5.0km</span>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                        {[
                            { name: "Rahul Sharma", role: "Elite Electrician", skill: "Expert", score: 99, level: "Master" },
                            { name: "Sanjay Gupta", role: "Master Plumber", skill: "Top Rated", score: 98, level: "Specialist" },
                            { name: "Amit Kumar", role: "Verified Specialist", skill: "Verified", score: 97, level: "Pro" }
                        ].map((talent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-white border border-brand-border/30 rounded-3xl flex items-center gap-6 group hover:border-brand-primary/50 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="w-20 h-20 bg-brand-secondary rounded-2xl overflow-hidden shrink-0 border border-brand-secondary flex items-center justify-center font-black text-brand-primary text-3xl shadow-lg">
                                    {talent.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="text-brand-secondary font-bold text-xl tracking-tight">{talent.name}</div>
                                        <ShieldCheck className="w-5 h-5 text-brand-primary" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-2 py-0.5 bg-brand-primary/10 text-brand-secondary text-[10px] font-bold rounded-md">
                                            {talent.role}
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-xs font-black">4.9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <div className="text-brand-secondary font-bold text-base tracking-tight">{talent.level}</div>
                                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Rank</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-2/5 space-y-16">
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        className="w-20 h-2 bg-brand-primary rounded-full origin-left" 
                    />
                    <h2 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                        Precision <br />
                        <span className="text-brand-primary">Hiring</span>
                    </h2>
                    <p className="text-xl text-brand-muted/80 font-semibold leading-relaxed">
                        Find the exact skill you need within 5km. No travel costs. No delays. 
                        Just pure operational efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {[
                        { title: "Velocity", desc: "Start work in minutes", icon: Zap, color: "text-amber-500" },
                        { title: "Trust", desc: "Verified skill profile", icon: ShieldCheck, color: "text-emerald-500" },
                        { title: "Elite", desc: "Certified top specialists", icon: Star, color: "text-brand-primary" }
                    ].map((feat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-8 group"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shrink-0 border border-brand-border shadow-xl group-hover:scale-110 group-hover:bg-brand-secondary transition-all">
                                <feat.icon className={`w-10 h-10 ${feat.color} group-hover:text-brand-primary transition-colors`} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-brand-secondary tracking-tight">{feat.title}</h4>
                                <p className="text-brand-muted font-semibold text-base">{feat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full py-5 bg-brand-secondary text-brand-primary rounded-2xl font-bold text-lg shadow-xl hover:bg-neutral-900 active:scale-[0.98] transition-all">
                    Launch Talent Search
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}
