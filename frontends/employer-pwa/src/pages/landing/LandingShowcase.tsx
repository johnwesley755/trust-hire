import { LayoutDashboard, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function LandingShowcase() {
  return (
    <section className="py-32 bg-brand-secondary text-white overflow-hidden relative">
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
        <div className="w-full lg:w-1/2 space-y-10 relative z-10">
          <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-black text-brand-primary uppercase tracking-[0.3em]"
            >
                Mission Control
            </motion.div>
            <h3 className="text-4xl lg:text-7xl font-black leading-[1] tracking-tighter">
                Manage Your <br className="hidden md:block" />
                Verified Fleet <br />
                <span className="text-brand-primary">from One Hub.</span>
            </h3>
          </div>
          
          <div className="space-y-6">
            {[
              "Geofenced Smart Attendance with biometric proof",
              "Automated On-Chain Payouts to verified accounts",
              "Real-time Performance Analytics & Trust Metrics",
              "Enterprise-Grade Compliance Guardrails built-in"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-5 group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-white/5 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-secondary transition-all">
                  <CheckCircle2 className="w-5 h-5 stroke-[3px]" />
                </div>
                <p className="text-lg font-bold text-white/60 group-hover:text-white transition-colors tracking-tight">{text}</p>
              </div>
            ))}
          </div>

          <button className="px-12 py-6 bg-brand-primary text-brand-secondary rounded-2xl font-black text-xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-4">
            Explore Dashboard
            <LayoutDashboard className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-[60px] blur-3xl group-hover:opacity-100 opacity-20 transition-opacity" />
          <div className="relative z-10 rounded-[60px] overflow-hidden border-8 border-white/5 shadow-2xl transform group-hover:rotate-1 group-hover:scale-105 transition-all duration-700">
            <img
                src="/assets/landing/dashboard-mockup.png"
                alt="Manage Team"
                className="w-full h-auto"
            />
          </div>
          
          {/* Floating Metric */}
          <motion.div 
            className="absolute -bottom-10 -left-10 p-8 glass-card rounded-[40px] z-20 border-2 border-brand-primary/20"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2">Fleet Reliability</div>
            <div className="text-4xl font-black text-brand-secondary">99.8%</div>
            <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase">Real-time Verified</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
