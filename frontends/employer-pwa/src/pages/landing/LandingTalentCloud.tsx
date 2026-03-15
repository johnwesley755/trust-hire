import { motion } from "framer-motion";
import { ShieldCheck, Globe, Star } from "lucide-react";

// const PROFESSIONALS = [
//   { name: "Arjun K.", role: "Lead Electrician", rating: 4.9, location: "Bangalore", image: "/images/indi_electrician.png" },
//   { name: "Priya S.", role: "Site Supervisor", rating: 4.8, location: "Mumbai", image: "/images/indi_supervisor.png" },
//   { name: "Rajesh M.", role: "HVAC Specialist", rating: 5.0, location: "Delhi", image: "/images/indi_group.png" },
// ];

export function LandingTalentCloud() {
  return (
    <section id="verification" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-black text-brand-primary uppercase tracking-[0.4em]"
              >
                The Talent Protocol
              </motion.div>
              <h2 className="text-5xl lg:text-7xl font-black text-brand-secondary tracking-tighter leading-none">
                India's First <br />
                <span className="text-brand-primary">Immutable</span> <br />
                Talent Cloud.
              </h2>
            </div>
            
            <p className="text-xl text-brand-muted font-bold leading-relaxed max-w-lg">
              We've digitized trust. Every professional on our platform has a 
              government-verified biometric profile and a blockchain-backed work history.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <div className="text-5xl font-black text-brand-secondary">100%</div>
                <div className="text-xs font-black uppercase text-brand-muted tracking-widest">Biometric Proof</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-black text-brand-secondary">0</div>
                <div className="text-xs font-black uppercase text-brand-muted tracking-widest">Identity Fraud</div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-6 p-4">
              {/* Feature Professional */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="col-span-2 relative aspect-video rounded-[60px] overflow-hidden border-4 border-white shadow-2xl group"
              >
                <img 
                    src="/images/indi_group.png" 
                    alt="Verified Pro" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-secondary/80 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-brand-primary" />
                        <span className="text-xs font-black uppercase tracking-widest">Verified Core Team</span>
                    </div>
                    <div className="text-3xl font-black">Industrial Deployments</div>
                </div>
              </motion.div>

              {/* Smaller Cards */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 glass-card rounded-[40px] border-2 border-brand-primary/10 shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black text-brand-secondary mb-2">Pan-India</div>
                <p className="text-[10px] font-black text-brand-muted uppercase">Network Presence</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-brand-secondary rounded-[40px] text-white shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-brand-primary flex items-center justify-center mb-6">
                    <Star className="w-6 h-6 fill-brand-primary" />
                </div>
                <div className="text-2xl font-black text-white mb-2">4.9/5</div>
                <p className="text-[10px] font-black text-white/40 uppercase">Avg. Talent Rating</p>
              </motion.div>
            </div>

            {/* Floating Talent Tag */}
            <motion.div 
                animate={{ x: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 p-6 glass-card rounded-3xl border border-brand-primary/20 shadow-2xl z-20"
            >
                <div 
                    className="absolute -inset-1 bg-linear-to-r from-brand-primary to-amber-600 rounded-full blur-[2px] opacity-30 duration-2000"
                    style={{ transition: 'opacity 2s ease-in-out' }} // Added for the duration-2000 to have an effect
                ></div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-primary">
                        <img src="/images/indi_supervisor.png" alt="pro" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-brand-secondary">Priya S.</div>
                        <div className="text-[10px] font-black text-emerald-600">Site Supervisor</div>
                    </div>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
