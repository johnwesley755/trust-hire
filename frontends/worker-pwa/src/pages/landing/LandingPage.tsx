import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { LandingNavbar } from "../../components/landing/LandingNavbar";
import { LandingHero } from "../../components/landing/LandingHero";
import { LandingMarquee } from "../../components/landing/LandingMarquee";
import { LandingBenefits } from "../../components/landing/LandingBenefits";
import { LandingVideoGuide } from "../../components/landing/LandingVideoGuide";
import { LandingProcess } from "../../components/landing/LandingProcess";
import { LandingCareerLevels } from "../../components/landing/LandingCareerLevels";
import { LandingEarnings } from "../../components/landing/LandingEarnings";
import { LandingTrust } from "../../components/landing/LandingTrust";
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
