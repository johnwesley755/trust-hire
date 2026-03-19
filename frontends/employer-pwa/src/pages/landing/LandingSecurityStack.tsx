import { motion } from "framer-motion";
import { ShieldCheck, UserCheck, Smartphone, CheckCircle2, Award, CreditCard, Shield } from "lucide-react";

// Asset paths
const SHIELD_IMG = "/images/security_shield.png";
const BIOMETRIC_IMG = "/images/biometric_scan.png";
const DOCUMENT_IMG = "/images/document_verify.png";
const PROFILE_IMG = "/images/indi_supervisor.png";

const STEPS = [
    { title: "ID Check", desc: "Aadhaar-Verified Identity", icon: Smartphone },
    { title: "Face Match", desc: "Biometric AI Protection", icon: UserCheck },
    { title: "Bank Link", desc: "Real-time Account Sync", icon: CreditCard },
    { title: "Skill Audit", desc: "Certified Proficiency", icon: Award },
    { title: "Risk Cover", desc: "100% Hire Insurance", icon: Shield }
];

export function LandingSecurityStack() {
  return (
    <section className="py-24 bg-white relative overflow-hidden min-h-screen flex flex-col justify-center" id="security">
      {/* Background oriented texture */}
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header - Now Centered */}
        <div className="text-center mb-20 space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-brand-primary/20"
            >
                Enterprise Security
            </motion.div>
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-brand-secondary"
            >
                The Zero <span className="text-brand-primary">Risk Model</span>
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-brand-muted/80 font-medium max-w-2xl mx-auto"
            >
                Every professional on TrustHire undergoes a multi-layer verification process 
                integrated directly with Government databases.
            </motion.p>
        </div>

        {/* Dynamic Collage Area */}
        <div className="relative h-[500px] mb-20 flex justify-center items-center">
            {/* Background Glow */}
            <div className="absolute w-[600px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Shield Image */}
            <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 w-80 aspect-square rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl"
            >
                <img src={SHIELD_IMG} alt="Security Shield" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-brand-secondary/40 to-transparent" />
            </motion.div>

            {/* Biometric Scan Mockup */}
            <motion.div 
                animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-0 -left-10 lg:left-20 z-10 w-56 aspect-3/4 rounded-2xl overflow-hidden border-4 border-white shadow-xl -rotate-12"
            >
                <img src={BIOMETRIC_IMG} alt="Biometric Scan" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white p-2 rounded-lg shadow-lg">
                    <UserCheck className="w-5 h-5" />
                </div>
            </motion.div>

            {/* Document Verify Mockup */}
            <motion.div 
                animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-0 -right-10 lg:right-20 z-30 w-64 aspect-4/3 rounded-2xl overflow-hidden border-4 border-white shadow-2xl rotate-8"
            >
                <img src={DOCUMENT_IMG} alt="Document Verification" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-brand-primary/10" />
            </motion.div>

            {/* Profile Context */}
            <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [5, -5, 5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-0 lg:right-40 z-10 w-44 aspect-square rounded-full border-4 border-white shadow-xl overflow-hidden"
            >
                <img src={PROFILE_IMG} alt="Verified Talent" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-brand-border text-[8px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Verified
                </div>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-40 -left-20 lg:-left-10 p-4 bg-white rounded-2xl shadow-xl border border-brand-border/30 z-30 flex items-center gap-3"
            >
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                    <Award className="text-brand-secondary w-5 h-5" />
                </div>
                <div>
                   <div className="text-[10px] font-bold text-brand-muted uppercase">Authority</div>
                   <div className="font-bold text-brand-secondary text-sm">Govt. Integrated</div>
                </div>
            </motion.div>
        </div>

        {/* Horizontal Scrolling Steps */}
        <div className="relative group overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
            
            <motion.div 
                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-10 no-scrollbar cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ right: 0, left: -400 }}
            >
                {STEPS.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="shrink-0 w-80 p-6 bg-white rounded-2xl border border-brand-border/30 shadow-lg hover:border-brand-primary/50 transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-brand-bg rounded-xl flex items-center justify-center group-hover:bg-brand-secondary transition-colors group-hover:scale-105 duration-300">
                                <step.icon className="w-7 h-7 text-brand-primary group-hover:text-brand-primary transition-colors" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center ml-auto">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                        <h4 className="text-xl font-bold text-brand-secondary mb-2 tracking-tight">{step.title}</h4>
                        <p className="text-brand-muted font-medium text-sm leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>

        {/* Final CTA Button */}
        <div className="flex justify-center mt-12">
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-brand-secondary text-brand-primary rounded-2xl font-bold text-lg shadow-xl hover:bg-neutral-900 transition-all flex items-center gap-3"
            >
                Review Full Security Stack
                <ShieldCheck className="w-5 h-5" />
            </motion.button>
        </div>
      </div>
    </section>
  );
}
