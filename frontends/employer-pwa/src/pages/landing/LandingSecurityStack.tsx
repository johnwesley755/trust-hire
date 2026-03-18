import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Smartphone, CheckCircle2 } from "lucide-react";

// Correct paths to assets in public directory
const SHIELD_IMG = "/images/security_shield.png";
const NODES_IMG = "/images/nodes_bg.png";

const STEPS = [
    { title: "ID Check", desc: "Aadhaar-Verified Identity", icon: Smartphone },
    { title: "Face Match", desc: "Biometric AI Protection", icon: UserCheck },
    { title: "Safe Hire", desc: "100% Risk Insurance", icon: ShieldCheck }
];

export function LandingSecurityStack() {
  return (
    <section className="py-32 bg-brand-bg relative overflow-hidden flex items-center min-h-[90vh]">
      {/* Background oriented texture */}
      <img src={NODES_IMG} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full relative z-10">
        {/* Left: 3D Illustration & Callouts */}
        <div className="relative order-2 lg:order-1 flex justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 w-full max-w-lg"
            >
                <img 
                    src={SHIELD_IMG} 
                    alt="Identity Shield" 
                    className="w-full h-auto drop-shadow-[0_50px_50px_rgba(250,204,21,0.3)] rounded-lg"
                />
            </motion.div>

            {/* Floating Info Panels */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 -left-10 p-8 glass-card rounded-lg z-20 space-y-3 hidden xl:block shadow-2xl"
            >
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="text-white w-7 h-7" />
                </div>
                <div className="font-bold text-brand-secondary text-lg">Aadhaar-Match</div>
                <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-emerald-500 rounded-full" />)}
                </div>
            </motion.div>
        </div>

        {/* Right: Copy & Steps */}
        <div className="space-y-16 order-1 lg:order-2">
            <div className="space-y-6 text-center lg:text-left">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-block px-4 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                >
                    Risk Insurance
                </motion.div>
                <h3 className="text-5xl lg:text-8xl font-extrabold tracking-tight leading-[0.85]">
                    Zero Identity <br />
                    <span className="text-brand-primary text-glow">Fraud.</span>
                </h3>
                <p className="text-xl text-brand-muted font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Stop worrying about absconding or fake IDs. 
                    Every worker is Biometric-Verified.
                </p>
            </div>

            <div className="space-y-6">
                {STEPS.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-8 p-6 bg-white rounded-lg border border-brand-border shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="w-20 h-20 bg-brand-bg rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
                            <step.icon className="w-10 h-10 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-2xl font-bold text-brand-secondary tracking-tight">{step.title}</h4>
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                            <p className="text-brand-muted font-bold italic">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
