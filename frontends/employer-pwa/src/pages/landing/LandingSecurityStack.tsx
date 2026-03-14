import { motion } from "framer-motion";
import { Fingerprint, ShieldCheck, Database, Lock, Eye } from "lucide-react";

// Correct paths to assets in public directory
const SHIELD_IMG = "/images/security_shield.png";
const NODES_IMG = "/images/nodes_bg.png";

const STACK = [
    { title: "Biometric AI", desc: "Face-match verification against national databases in < 2 seconds.", icon: Fingerprint },
    { title: "Blockchain Ledger", desc: "Every rating and work hour is signed on an immutable private chain.", icon: Database },
    { title: "Identity Vault", desc: "GDPR compliant encryption for all sensitive worker credentials.", icon: Lock },
    { title: "AI-Vision Scouting", desc: "Automated CV analysis and skill-score projection engine.", icon: Eye }
];

export function LandingSecurityStack() {
  return (
    <section className="py-32 bg-brand-bg relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Background oriented texture */}
      <img src={NODES_IMG} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
        {/* Left: 3D Illustration & Callouts */}
        <div className="relative order-2 lg:order-1 flex justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 w-full max-w-md"
            >
                <img 
                    src={SHIELD_IMG} 
                    alt="Security Infrastructure" 
                    className="w-full h-auto drop-shadow-[0_35px_35px_rgba(250,204,21,0.25)] rounded-[60px]"
                />
            </motion.div>

            {/* Floating Info Panels */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 -left-10 p-6 glass-card rounded-3xl z-20 space-y-2 hidden xl:block"
            >
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-brand-secondary w-6 h-6" />
                </div>
                <div className="font-black text-brand-secondary text-sm">FaceID Verified</div>
                <div className="text-[10px] font-bold text-brand-muted uppercase">99.9% Accuracy</div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -right-10 p-6 glass-card rounded-3xl z-20 space-y-2 hidden xl:block"
            >
                <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
                    <Database className="text-white w-6 h-6" />
                </div>
                <div className="font-black text-brand-secondary text-sm">On-Chain Ledger</div>
                <div className="text-[10px] font-bold text-brand-muted uppercase">Immutable History</div>
            </motion.div>
        </div>

        {/* Right: Copy & Stack Grid */}
        <div className="space-y-12 order-1 lg:order-2">
            <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-sm font-black text-brand-accent uppercase tracking-[0.3em]">The Security Perimeter</h2>
                <h3 className="text-4xl lg:text-7xl font-black text-brand-secondary tracking-tighter leading-[0.9]">
                    Unbreakable <br />
                    <span className="text-brand-primary">Verification.</span>
                </h3>
                <p className="text-lg text-brand-muted font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                    We've replaced manual checks with an integrated infrastructure of AI and Blockchain. Deploy workers with 100% confidence.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {STACK.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white/50 backdrop-blur-sm rounded-[32px] border border-brand-border hover:border-brand-primary transition-all group shadow-sm hover:shadow-xl"
                    >
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-brand-primary group-hover:text-brand-secondary transition-all">
                            <item.icon className="w-6 h-6 text-brand-primary group-hover:text-brand-secondary transition-colors" />
                        </div>
                        <h4 className="text-xl font-black text-brand-secondary mb-2 tracking-tight">{item.title}</h4>
                        <p className="text-xs text-brand-muted font-bold leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
