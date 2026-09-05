import { useState, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { LandingNavbar } from "../components/LandingNavbar";
import { EmployerHero } from "../components/EmployerHero";
import { WorkerHero } from "../components/WorkerHero";
import { LandingMarquee } from "../components/LandingMarquee";
import { LandingProblemSolution } from "../components/LandingProblemSolution";
import { LandingVideoDemo } from "../components/LandingVideoDemo";
import { LandingHowItWorks } from "../components/LandingHowItWorks";
import { LandingTierSystem } from "../components/LandingTierSystem";
import { LandingSecurityStack } from "../components/LandingSecurityStack";
import { LandingDualCTA } from "../components/LandingDualCTA";
import { LandingBenefits } from "../components/LandingBenefits";
import { LandingVideoGuide } from "../components/LandingVideoGuide";
import { LandingProcess } from "../components/LandingProcess";
import { LandingCareerLevels } from "../components/LandingCareerLevels";
import { LandingEarnings } from "../components/LandingEarnings";
import { LandingTrust } from "../components/LandingTrust";
import { LandingTestimonials } from "../components/LandingTestimonials";
import { LandingFinalCTA } from "../components/LandingFinalCTA";
import { LandingFooter } from "../components/LandingFooter";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [mode, setMode] = useState<'employer' | 'worker'>('employer');

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F4EF] font-['Bricolage_Grotesque'] text-[#1F3F34] selection:bg-[#FACD15] selection:text-[#002117] antialiased">
      <LandingNavbar mode={mode} onToggleMode={setMode} />

      {/* Floating Mode Switcher for Mobile */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1F3F34] text-white p-1 rounded-full shadow-2xl flex items-center gap-1 border border-[#FACD15]/40">
        <button
          onClick={() => setMode('employer')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
            mode === 'employer' ? 'bg-[#FACD15] text-[#1F3F34]' : 'text-white/70'
          }`}
        >
          Employers
        </button>
        <button
          onClick={() => setMode('worker')}
          className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
            mode === 'worker' ? 'bg-[#FACD15] text-[#1F3F34]' : 'text-white/70'
          }`}
        >
          Workers
        </button>
      </div>

      <main className="pt-[72px]">
        <AnimatePresence mode="wait">
          {mode === 'employer' ? (
            <motion.div
              key="employer-experience"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <EmployerHero />
              <LandingMarquee />
              <LandingProblemSolution />
              <LandingVideoDemo />
              <LandingHowItWorks />
              <LandingTierSystem />
              <LandingSecurityStack />
              <LandingDualCTA />
              <LandingTestimonials />
              <LandingFinalCTA />
            </motion.div>
          ) : (
            <motion.div
              key="worker-experience"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WorkerHero />
              <LandingMarquee />
              <LandingBenefits />
              <LandingVideoGuide />
              <LandingProcess />
              <LandingCareerLevels />
              <LandingEarnings />
              <LandingTrust />
              <LandingTestimonials />
              <LandingFinalCTA />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <LandingFooter />
    </div>
  );
}
