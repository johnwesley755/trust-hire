import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { LandingNavbar } from "../components/LandingNavbar";
import { LandingHero } from "../components/LandingHero";
import { LandingMarquee } from "../components/LandingMarquee";
import { LandingBenefits } from "../components/LandingBenefits";
import { LandingVideoGuide } from "../components/LandingVideoGuide";
import { LandingProcess } from "../components/LandingProcess";
import { LandingCareerLevels } from "../components/LandingCareerLevels";
import { LandingEarnings } from "../components/LandingEarnings";
import { LandingTrust } from "../components/LandingTrust";
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
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased selection:bg-primary-fixed selection:text-primary">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingMarquee />
        <LandingBenefits />
        <LandingVideoGuide />
        <LandingProcess />
        <LandingCareerLevels />
        <LandingEarnings />
        <LandingTrust />
        <LandingTestimonials />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
