import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Banknote } from "lucide-react";

export function LandingTrust() {
  const stats = [
    { label: "Jobs Completed", value: "250K+" },
    { label: "Worker Payouts", value: "₹50Cr+" },
    { label: "Verified Employers", value: "10,000+" },
    { label: "Average Rating", value: "4.8/5" },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#1d4744] font-black text-sm uppercase tracking-[0.2em] bg-[#1d4744]/10 px-3 py-1 rounded-full">
              Trust & Safety
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111] mt-6 leading-tight mb-6">
              Your safety and pay are <br />our <span className="text-[#f0b429]">top priority.</span>
            </h2>
            <p className="text-[#666] text-lg font-medium leading-relaxed mb-8">
              We vet every employer on our platform. Your contracts are legally binding, your payments are secured in escrow, and our support team is available 24/7 if anything goes wrong.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1d4744]/10 flex items-center justify-center shrink-0">
                  <Banknote className="w-6 h-6 text-[#1d4744]" />
                </div>
                <div>
                  <h4 className="font-black text-[#111] text-lg mb-1">Guaranteed Pay</h4>
                  <p className="text-[#666] text-sm font-medium">Employers deposit funds before you start.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f0b429]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#f0b429]" />
                </div>
                <div>
                  <h4 className="font-black text-[#111] text-lg mb-1">Safe Workplaces</h4>
                  <p className="text-[#666] text-sm font-medium">Strict code of conduct for all business partners.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-[#f5f4ef] rounded-[40px] p-10 lg:p-12 relative"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              {stats.map((stat, i) => (
                <div key={i}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="text-4xl sm:text-5xl font-black text-[#1d4744] mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[#666] font-bold text-sm tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
