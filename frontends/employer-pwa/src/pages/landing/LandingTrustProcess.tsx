import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Database, Zap } from "lucide-react";

const PROCESS_STEPS = [
  {
    title: "AI Face Match",
    desc: "Real-time biometric verification against government IDs.",
    icon: UserCheck,
    color: "text-brand-accent",
  },
  {
    title: "Blockchain History",
    desc: "Immutable work records and rating history on-chain.",
    icon: Database,
    color: "text-brand-primary",
  },
  {
    title: "Digital Footprint",
    desc: "360-degree background sync across social and professional nodes.",
    icon: ShieldCheck,
    color: "text-blue-500",
  },
  {
    title: "Instant Match",
    desc: "AI-priority scouting based on skill score and proximity.",
    icon: Zap,
    color: "text-amber-500",
  },
];

export function LandingTrustProcess() {
  return (
    <section id="vision" className="py-32 bg-brand-secondary text-white overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-sm font-black text-brand-primary uppercase tracking-[0.3em]">The Trust Infrastructure</h2>
          <h3 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
            Verified Talent, <br />
            <span className="text-brand-primary">Powered by Truth.</span>
          </h3>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-bold">
            We've built the ultimate trust layer for modern businesses. No more fake profiles, no more background check delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-all">
                <step.icon className={`w-8 h-8 ${step.color} group-hover:text-brand-secondary transition-colors`} />
              </div>
              <h4 className="text-2xl font-black mb-3">{step.title}</h4>
              <p className="text-sm text-white/50 font-bold leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Visual Callout */}
        <motion.div 
            className="mt-20 p-10 bg-brand-primary rounded-[60px] flex flex-col lg:flex-row items-center justify-between gap-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
        >
            <div className="space-y-4 text-center lg:text-left">
                <h4 className="text-3xl font-black text-brand-secondary tracking-tighter">Ready to Scout Your Dream Team?</h4>
                <p className="text-brand-secondary/70 font-bold max-w-lg leading-relaxed">Join 15,000+ companies that trust our AI-verified workforce for their most critical projects.</p>
            </div>
            <div className="flex gap-4">
                <button className="px-10 py-5 bg-brand-secondary text-brand-primary rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Start Scouting
                </button>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
