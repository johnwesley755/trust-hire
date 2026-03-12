import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Zap, CheckCircle } from "lucide-react";

export function LandingTrust() {
  const securityFeatures = [
    { title: "SHA-256 Masking", desc: "Your Aadhaar is tokenized. We only see XXXX-XXXX-1234.", icon: <ShieldAlert className="w-6 h-6" /> },
    { title: "n8n AI Orchestrator", desc: "Automated background checks synced across all services.", icon: <Zap className="w-6 h-6" /> },
    { title: "UIDAI Compliant", desc: "Full adherence to latest India DPDP Act 2023 guidelines.", icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* ── Background Decorative ── */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] -mr-40" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-xs font-black uppercase tracking-widest border border-brand-teal/20 mb-8">
              Privacy First Platform
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] leading-[1.1] mb-8">
              Your identity is <br />
              <span className="text-brand-teal relative inline-block">
                Never Stored.
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-1 left-0 w-full h-3 bg-brand-amber/20 -z-10 origin-left"
                />
              </span>
            </h2>
            <p className="text-[#555] text-lg font-medium leading-relaxed mb-12 max-w-xl">
              TrustHire uses bank-grade SHA-256 hashing to protect your Aadhaar. 
              Our n8n-powered verification engine ensures zero human access to 
              your sensitive documents.
            </p>

            <div className="space-y-8">
              {securityFeatures.map((feature, i) => (
                <div key={i} className="flex gap-6 items-center p-4 rounded-3xl hover:bg-brand-cream transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 transform group-hover:-rotate-6">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-[#111] text-lg mb-1">{feature.title}</h4>
                    <p className="text-[#666] text-sm font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Privacy Animation */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 bg-[#111] rounded-[48px] lg:rounded-[60px] p-8 sm:p-12 lg:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.3)] lg:shadow-[0_60px_100px_rgba(29,71,68,0.2)]"
            >
              <div className="absolute top-0 right-0 p-6 sm:p-8">
                <ShieldCheck className="w-8 h-8 sm:w-12 sm:h-12 text-brand-amber opacity-20" />
              </div>
              
              <div className="space-y-8 lg:space-y-12">
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-brand-teal font-black text-[10px] sm:text-xs uppercase tracking-widest">Aadhaar Data (Input)</p>
                  <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                    <p className="text-white/40 font-mono text-base sm:text-lg tracking-[0.3em] sm:tracking-[0.4em]">1234 5678 9012</p>
                  </div>
                </div>
 
                <div className="flex justify-center">
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-brand-teal/30 flex items-center justify-center"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 sm:w-6 sm:h-6 border-b-2 border-brand-amber rounded-full" />
                  </motion.div>
                </div>
 
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-brand-amber font-black text-[10px] sm:text-xs uppercase tracking-widest">SHA-256 Token (Stored)</p>
                  <div className="bg-brand-teal/20 border border-brand-teal/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                    <p className="text-brand-teal font-mono text-[9px] sm:text-[10px] break-all opacity-80 leading-relaxed">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855...
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-amber/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-teal/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
