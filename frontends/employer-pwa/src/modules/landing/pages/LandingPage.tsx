import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { LandingNavbar } from "../components/LandingNavbar";
import { LandingHero } from "../components/LandingHero";
import { LandingMarquee } from "../components/LandingMarquee";
import { LandingProblemSolution } from "../components/LandingProblemSolution";
import { LandingVideoDemo } from "../components/LandingVideoDemo";
import { LandingHowItWorks } from "../components/LandingHowItWorks";
import { LandingTierSystem } from "../components/LandingTierSystem";
import { LandingSecurityStack } from "../components/LandingSecurityStack";
import { LandingDualCTA } from "../components/LandingDualCTA";
import { LandingTestimonials } from "../components/LandingTestimonials";
import { LandingFinalCTA } from "../components/LandingFinalCTA";
import { LandingFooter } from "../components/LandingFooter";

export default function LandingPage() {
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
    <div className="min-h-screen bg-brand-beige selection:bg-brand-amber selection:text-brand-forest">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingMarquee />
        <LandingProblemSolution />
        <LandingVideoDemo />
        <LandingHowItWorks />
        <LandingTierSystem />
        <LandingSecurityStack />
        <LandingDualCTA />
        <LandingTestimonials />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
