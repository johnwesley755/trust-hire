import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { LandingNavbar } from "../../components/landing/LandingNavbar";
import { LandingHero } from "../../components/landing/LandingHero";
import { LandingMarquee } from "../../components/landing/LandingMarquee";
import { LandingProblemSolution } from "../../components/landing/LandingProblemSolution";
import { LandingVideoDemo } from "../../components/landing/LandingVideoDemo";
import { LandingHowItWorks } from "../../components/landing/LandingHowItWorks";
import { LandingTierSystem } from "../../components/landing/LandingTierSystem";
import { LandingSecurityStack } from "../../components/landing/LandingSecurityStack";
import { LandingDualCTA } from "../../components/landing/LandingDualCTA";
import { LandingTestimonials } from "../../components/landing/LandingTestimonials";
import { LandingFinalCTA } from "../../components/landing/LandingFinalCTA";
import { LandingFooter } from "../../components/landing/LandingFooter";

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
    <div className="min-h-screen bg-[#F5F4EF] selection:bg-[#FACD15] selection:text-[#1F3F34]">
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
