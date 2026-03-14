import { LandingNavbar } from "./landing/LandingNavbar";
import { LandingHero } from "./landing/LandingHero";
import { LandingCinematic } from "./landing/LandingCinematic";
import { LandingStats } from "./landing/LandingStats";
import { LandingScoutingDemo } from "./landing/LandingScoutingDemo";
import { LandingTalentCloud } from "./landing/LandingTalentCloud";
import { LandingSecurityStack } from "./landing/LandingSecurityStack";
import { LandingHowItWorks } from "./landing/LandingHowItWorks";
import { LandingFeatures } from "./landing/LandingFeatures";
import { LandingShowcase } from "./landing/LandingShowcase";
import { LandingTrustProcess } from "./landing/LandingTrustProcess";
import { LandingNetwork } from "./landing/LandingNetwork";
import { LandingFooter } from "./landing/LandingFooter";
import { ReactLenis } from "lenis/react";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-brand-bg selection:bg-brand-primary selection:text-brand-secondary selection:font-black">
        <LandingNavbar />
        <main>
          <LandingHero />
          <LandingCinematic />
          <LandingStats />
          <LandingScoutingDemo />
          <LandingTalentCloud />
          <LandingSecurityStack />
          <LandingHowItWorks />
          <LandingFeatures />
          <LandingShowcase />
          <LandingTrustProcess />
          <LandingNetwork />
        </main>
        <LandingFooter />
      </div>
    </ReactLenis>
  );
}
