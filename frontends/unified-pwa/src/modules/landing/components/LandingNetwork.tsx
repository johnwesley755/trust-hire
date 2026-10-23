import { Link } from "react-router-dom";
import { CheckCircle2, Globe2 } from "lucide-react";

const VERIFICATION_STEPS = [
  "Biometric Identity Verification",
  "Blockchain Work History Ledger",
  "Comprehensive Background Checks",
  "NQF-Aligned Skill Validation",
];

export function LandingNetwork() {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
        {/* Image - Using Hero Illustration for Group Feel */}
        <div className="w-full lg:w-1/2 rounded-[60px] overflow-hidden shadow-2xl border-4 border-white group bg-brand-surface relative aspect-square">
            <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
                src="/images/indi_group.png"
                alt="Verified Indian Workforce"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]"
            />
            {/* Overlay badge */}
            <div className="absolute bottom-10 left-10 z-20 bg-brand-secondary text-brand-primary px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-2xl border border-white/10">
                <Globe2 className="w-5 h-5" />
                PAN-INDIA VERIFICATION
            </div>
        </div>

        {/* Copy */}
        <div className="w-full lg:w-1/2 space-y-12">
          <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-sm font-bold text-brand-accent uppercase tracking-widest"
            >
                Global Reach, Local Trust
            </motion.div>
            <h3 className="text-4xl lg:text-7xl font-extrabold text-brand-secondary leading-[1] tracking-tight">
              Nationwide Force, <br />
              <span className="text-brand-primary">Verified by Truth.</span>
            </h3>
            <p className="text-xl text-brand-muted leading-relaxed font-bold">
              TrustHire provides access to the largest verified professional network in India. 
              Our blockchain-backed identity layer ensures that every hire is safe, secure, 
              and legally compliant.
            </p>
          </div>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VERIFICATION_STEPS.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-4 font-bold text-brand-secondary group text-sm"
              >
                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-secondary transition-all">
                  <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
                </div>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-6">
            <Link
                to="/sign-up?role=WORKER"
                className="inline-block px-12 py-6 bg-brand-secondary text-brand-primary rounded-2xl font-bold text-lg transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
                Join the Network
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
