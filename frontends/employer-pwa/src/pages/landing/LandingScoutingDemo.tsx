import { motion } from "framer-motion";
import { Search, MapPin, Filter, MoreHorizontal, UserCheck, Star, Clock } from "lucide-react";

export function LandingScoutingDemo() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0 cloud-grid pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
            {/* Left: Interactive Mockup UI */}
            <div className="w-full lg:w-3/5 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 lg:p-12 bg-brand-secondary rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative z-10 border-4 border-white/10"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent rounded-[56px] pointer-events-none" />
                    {/* Mock Toolbar */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                                <Search className="text-brand-secondary w-5 h-5" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global Scouting Filter</div>
                                <div className="text-sm font-black text-white">Construction / Logistics</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-brand-primary">
                                4,208 Results
                            </div>
                            <button className="p-2 bg-white/5 rounded-xl text-white">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mock Search Input */}
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 mb-8">
                        <MapPin className="text-brand-primary w-5 h-5" />
                        <span className="text-white font-bold opacity-60">Mumbai, Maharashtra</span>
                        <div className="ml-auto flex gap-2">
                            <span className="px-2 py-1 bg-brand-primary text-brand-secondary text-[10px] font-black rounded uppercase">Live</span>
                        </div>
                    </div>

                    {/* Talent List (Animated) */}
                    <div className="space-y-4">
                        {[
                            { name: "Karan Johar", role: "Hard Hat Supervisor", score: 99.2, status: "Verified" },
                            { name: "Aman Gupta", role: "HVAC Technician", score: 98.5, status: "Verified" },
                            { name: "Vinay Singh", role: "Safety Officer", score: 97.4, status: "Vetting" }
                        ].map((talent, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6 group hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-brand-surface rounded-2xl overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                    <div className="w-full h-full bg-brand-primary/20 flex items-center justify-center font-black text-brand-secondary">
                                        {talent.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-black">{talent.name}</div>
                                    <div className="text-xs font-bold text-white/50">{talent.role}</div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <div className="text-brand-primary font-black text-lg">%{talent.score}</div>
                                    <div className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{talent.status}</div>
                                </div>
                                <button className="p-2 text-white/30 group-hover:text-brand-primary">
                                    <MoreHorizontal className="w-6 h-6" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Floating Pulse Widget */}
                    <div className="absolute -bottom-6 -right-6 p-4 bg-white rounded-3xl shadow-2xl z-20 border border-brand-border flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-accent/10 rounded-full flex items-center justify-center relative">
                            <UserCheck className="text-brand-accent w-6 h-6" />
                            <div className="absolute inset-0 bg-brand-accent rounded-full animate-ping opacity-20" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-brand-muted uppercase">Global Match</div>
                            <div className="text-sm font-black text-brand-secondary">Scanning...</div>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-[60px] -z-10" />
            </div>

            {/* Right: Copy */}
            <div className="w-full lg:w-2/5 space-y-10">
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-brand-accent uppercase tracking-[0.3em]">Live Scouting Demo</h2>
                    <h3 className="text-4xl lg:text-7xl font-black text-brand-secondary tracking-tighter leading-none">
                        Interactive <br />
                        <span className="text-brand-primary">Search.</span>
                    </h3>
                    <p className="text-lg text-brand-muted font-bold leading-relaxed">
                        Experience the speed of our global verified network. Filter by category, location, and verification score in real-time.
                    </p>
                </div>

                <div className="space-y-6">
                    {[
                        { title: "Smart Filter", desc: "Filter by 50+ industrial skill categories correctly.", icon: Star },
                        { title: "Proximity Sync", desc: "Find workers within 5km of your job site instantly.", icon: MapPin },
                        { title: "One-Click Deploy", desc: "Send offers to vetted talent in a single tap.", icon: Clock }
                    ].map((feat, i) => (
                        <div key={i} className="flex gap-6 items-start group">
                            <div className="w-12 h-12 bg-brand-surface rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-primary transition-all">
                                <feat.icon className="w-6 h-6 text-brand-primary group-hover:text-brand-secondary transition-colors" />
                            </div>
                            <div>
                                <h4 className="font-black text-brand-secondary">{feat.title}</h4>
                                <p className="text-sm text-brand-muted font-bold leading-relaxed italic">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full py-5 bg-black text-brand-primary rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all">
                    Try The Scout Tool
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}
